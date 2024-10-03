import {initialize} from "./canvas-initialize.js";
import {Columns, Align, DataType} from "./columns.js";
import {Regions} from "./factories/regions-factory.js";
import {BooleanImages} from "./factories/boolean-images-factory.js";
import {SizesManager} from "../../src/managers/grid-data-managers/sizes-manager.js";
import {InputManager} from "./managers/input-manager.js";
import {renderCanvas, createRenderLT} from "./renderers/render.js";
import {createEditorLT} from "./editors/editor.js";
import {HoverManager} from "./managers/hover-manager.js";
import {hover} from "./hovering/hovering.js";
import {OverlayManager, OverlayChanges} from "./managers/overlay-manager.js";
import {startDrag} from "./drag-drop/drag-drop.js";

class MatrixRenderer extends HTMLElement {
    #ctx;
    #scrollElement;
    #scrollMarkerElement;
    #config;
    #groupSizes;
    #columnSizes;
    #rowSizes;
    #animating = false;
    #animationId;
    #updateOptions = OverlayChanges.SELECTION;
    #scrollLeft = 0;
    #scrollTop = 0;
    #scrollOldLeft = 0;
    #scrollOldTop = 0;
    #lastTime = 0;
    #inputManager = new InputManager();
    #dataManagerChangedHandler = this.#dataManagerChange.bind(this);
    #onScrollHandler = this.#onScroll.bind(this);
    #onMouseEventHandler = this.#onMouseEvent.bind(this);
    #onKeyDownHandler = this.#onKeyDown.bind(this);
    #animateHandler = this.#animate.bind(this);
    #focusHandler = this.#focus.bind(this);
    #hoverHandler = this.#hover.bind(this);
    #startDragHandler = startDrag.bind(this);
    #renderLT = createRenderLT();
    #editorLT = createEditorLT();
    #updateAABBCallbackHandler = this.#updateAABBCallback.bind(this);
    #hoverManager = new HoverManager();
    #cellAABB = { x1: 0, x2: 0, y1: 0, y2: 0 };
    #overlayManager;
    #selection = {
        row: 0,
        column: 0
    }
    #copyValue;
    #copyDataType;

    get rowSizes() {
        return this.#rowSizes;
    }

    get columnSizes() {
        return this.#columnSizes;
    }

    get selection() {
        return this.#selection;
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        await this.#loadHTML();
        await this.load();
    }

    async #loadHTML() {
        const currentURL = import.meta.url;
        const htmlURL = new URL("./matrix-renderer.html", currentURL);
        const cssURL = new URL("./matrix-renderer.css", currentURL);

        const html = await fetch(htmlURL).then(result => result.text());
        this.shadowRoot.innerHTML = `<link rel="stylesheet" href="${cssURL}">${html}`;
    }

    async disconnectedCallback() {
        await crs.call("data_manager", "remove_change", {
            manager: this.#config.manager,
            callback: this.#dataManagerChangedHandler
        });

        await crsbinding.events.emitter.remove("matrix-editing-removed", this.#focusHandler);

        this.#dataManagerChangedHandler = null;

        this.#scrollElement.removeEventListener("scroll", this.#onScrollHandler);
        this.#scrollElement = null;
        this.#scrollMarkerElement = null;

        this.removeEventListener("click", this.#onMouseEventHandler);
        this.removeEventListener("dblclick", this.#onMouseEventHandler);
        this.removeEventListener("keydown", this.#onKeyDownHandler);
        this.removeEventListener("mousedown", this.#startDragHandler);

        this.#startDragHandler = null;
        this.#ctx = null;
        this.#config = null;
        this.#groupSizes = this.#groupSizes?.dispose();
        this.#rowSizes = this.#rowSizes.dispose();
        this.#columnSizes = this.#columnSizes.dispose();
        this.#onScrollHandler = null;
        this.#animateHandler = null;
        this.#updateAABBCallbackHandler = null;
        this.#renderLT = null;
        this.#inputManager = this.#inputManager.dispose();
        this.#overlayManager = this.#overlayManager.dispose();
        this.#selection = null;

        this.#hoverManager.removeEventListener("hover", this.#hoverHandler);
        this.#hoverManager = this.#hoverManager.dispose();
    }

    #updateAccessibility() {
        const field = this.#config.columns[this.#selection.column].field;
        const row = this.#config.rows[this.#selection.row];
        const value = row[field];
        const accessibilityText = `row ${this.#selection.row}, field ${field}, value ${value}`;
        this.setAttribute("aria-label", accessibilityText);
    }

    #focus() {
        this.focus();
    }

    #hover(event) {
        const pageDetails = this.#getPageDetails();

        const details = {
            pageDetails,
            offsetX     : event.detail.x,
            offsetY     : event.detail.y,
            def         : this.#config,
            scrollLeft  : this.#scrollLeft,
            scrollTop   : this.#scrollTop,
            columnSizes : this.#columnSizes,
            rowSizes    : this.#rowSizes,
            canvasAABB  : this.#ctx.canvas.getBoundingClientRect()
        }

        hover(this.#ctx, this, details);
    }

    #animate() {
        const currentTime = performance.now();

        const pageDetails = this.refresh();
        this.#updateMarkerPosition()

        // if we stop scrolling render the final frame
        const deltaTime = currentTime - this.#lastTime;
        if (deltaTime > 200) {
            this.#animating = false;
            return this.#finalRender(pageDetails);
        }

        if (this.#animating) {
            this.#animationId = requestAnimationFrame(this.#animateHandler);
        }
    }

    #onScroll(event) {
        this.#lastTime = performance.now();
        this.#scrollLeft = Math.ceil(event.target.scrollLeft);
        this.#scrollTop = Math.ceil(event.target.scrollTop);

        const deltaX = this.#scrollLeft - this.#scrollOldLeft;
        const deltaY = this.#scrollTop - this.#scrollOldTop;

        this.#scrollOldLeft = this.#scrollLeft;
        this.#scrollOldTop = this.#scrollTop;

        this.#updateOptions = OverlayChanges.SELECTION;

        if (deltaX !== 0) {
            this.#updateOptions |= OverlayChanges.COLUMNS;
        }

        if (deltaY !== 0) {
            this.#updateOptions |= OverlayChanges.ROWS;
        }

        if (!this.#animating) {
            this.#animating = true;
            this.#animate(this.#lastTime);
        }
    }

    #onKeyDown(event) {
        requestAnimationFrame(() => {
            const action = this.#inputManager.getInputAction(event);
            this[action]?.(event);
        })
        event.preventDefault();
        event.stopPropagation();
    }

    #onMouseEvent(event) {
        // clicked on grouping region
        if (event.offsetY < this.#config.regions.header.top) {
            return;
        }

        if (event.offsetY < this.#config.regions.cells.top) {
            return this.#onClickHeader(event);
        }

        this.#onClickCells(event);
    }

    #onClickHeader() {
        // JHR: required for data grid but for now a placeholder
        return;
    }

    #onClickCells(event) {
        const action = this.#inputManager.getInputAction(event);
        this[action]?.(event);
    }

    #getFrozenDetails() {
        if (this.#config.frozenColumns == null) {
            return;
        }

        const columnsActualSizes = [];
        const columnsCumulativeSizes = [];

        for (let i = 0; i < this.#config.frozenColumns.count; i++) {
            columnsActualSizes.push(this.#columnSizes.at(i));
            columnsCumulativeSizes.push(this.#columnSizes.cumulative(i));
        }

        this.#config.frozenColumns.columnsActualSizes = columnsActualSizes;
        this.#config.frozenColumns.columnsCumulativeSizes = columnsCumulativeSizes;
    }

    #getPageDetails() {
        const visibleGroups = this.#groupSizes?.getVisibleRange(this.#scrollLeft, this.#ctx.canvas.width - 16);
        const visibleColumns = this.#columnSizes.getVisibleRange(this.#scrollLeft, this.#ctx.canvas.width - 16);
        const visibleRows = this.#rowSizes.getVisibleRange(this.#scrollTop, this.#config.regions.cells.height -16);

        const columnsActualSizes = [];
        const columnsCumulativeSizes = [];
        const rowsActualSizes = [];
        const rowsCumulativeSizes = [];
        const groupsActualSizes = [];
        const groupsCumulativeSizes = [];

        for (let i = visibleColumns.start; i <= visibleColumns.end; i++) {
            columnsActualSizes.push(this.#columnSizes.at(i));
            columnsCumulativeSizes.push(this.#columnSizes.cumulative(i));
        }

        for (let i = visibleRows.start; i <= visibleRows.end; i++) {
            rowsActualSizes.push(this.#rowSizes.at(i));
            rowsCumulativeSizes.push(this.#rowSizes.cumulative(i));
        }

        if (visibleGroups != null) {
            for (let i = visibleGroups.start; i <= visibleGroups.end; i++) {
                groupsActualSizes.push(this.#groupSizes.at(i));
                groupsCumulativeSizes.push(this.#groupSizes.cumulative(i));
            }
        }

        const columnLocation = this.#columnSizes.cumulative(visibleColumns.start);
        const rowLocation = this.#rowSizes.cumulative(visibleRows.start);

        return {
            visibleColumns,
            columnsActualSizes,
            columnsCumulativeSizes,
            visibleRows,
            rowsActualSizes,
            rowsCumulativeSizes,
            visibleGroups,
            groupsActualSizes,
            groupsCumulativeSizes,
            columnLocation,
            rowLocation,
            selection: this.#selection
        };
    }

    #dataManagerChange() {
        this.refresh();
    }

    #updateMarkerPosition() {
        this.#updateAccessibility();

        const pageDetails = this.#getPageDetails();

        this.#overlayManager.update(
            this.#updateOptions,
            this,
            this.#config,
            pageDetails,
            this.#scrollLeft,
            this.#scrollTop,
            this.#updateAABBCallbackHandler);
    }

    async #ensureMarkerVisible() {
        let changed = false;
        const frozenRight = this.#config.regions.frozenColumns?.right ?? 0;
        const isInFrozenZone = this.#selection.column < this.#config.frozenColumns?.count ?? 0;

        // only check this if you are not in the frozen zone
        if (!isInFrozenZone) {
            // Check for conditions to the right of the scrollable area
            if (this.#cellAABB.x2 > this.offsetWidth) {
                const diff = this.#cellAABB.x2 - this.offsetWidth;
                this.#scrollElement.scrollLeft += diff + 16;
                changed = true;
            }

            // check for conditions to the left referencing the frozen columns right edge
            if (this.#cellAABB.x1 < frozenRight) {
                const diff = frozenRight - this.#cellAABB.x1;
                this.#scrollElement.scrollLeft -= diff;
                changed = true;
            }
        }

        // check if the selected is overflowing at the bottom
        if (this.#cellAABB.y2 + 16 > this.offsetHeight) {
            const diff = this.#cellAABB.y2 - this.offsetHeight;
            this.#scrollElement.scrollTop += diff + 16;
            changed = true;
        }

        if (this.#cellAABB.y1 < this.#config.regions.cells.top) {
            const diff = this.#cellAABB.y1 - this.#config.regions.cells.top;
            this.#scrollElement.scrollTop += diff;
            changed = true;
        }

        // if change were made, update the page accordingly
        if (changed) {
            this.refresh();
            await this.#updateMarkerPosition();
        }
    }

    async #disposeParts() {
        // if there are no changes don't try and clean it up
        if (this.#config == null) {
            return;
        }

        cancelAnimationFrame(this.#animationId);
        // dispose of existing resources as it will be recreated
        await crs.call("data_manager", "remove_change", {
            manager: this.#config.manager,
            callback: this.#dataManagerChangedHandler
        });

        this.#overlayManager = this.#overlayManager.dispose();
        this.#rowSizes = this.#rowSizes.dispose();
        this.#columnSizes = this.#columnSizes.dispose();
        this.#groupSizes = this.#groupSizes?.dispose();
        this.#config.columns = null;
        this.#config.rows = null;
        this.#config.regions = null;
        this.#config.images = null;
        this.#config = null;
        this.#scrollElement.scrollLeft = 0;
        this.#scrollElement.scrollTop = 0;
        this.#scrollTop = 0;
        this.#scrollLeft = 0;
        this.#cellAABB = { x1: 0, x2: 0, y1: 0, y2: 0 };
        this.#selection = {
            row: 0,
            column: 0
        }
        this.#lastTime = 0;
        this.#animating = false;
    }

    async #finalRender(pageDetails) {
        pageDetails ||= this.#getPageDetails();
        renderCanvas(this.#ctx, this.#config, pageDetails, this.#renderLT, this.#scrollLeft, this.#scrollTop, true);

        // is the selected row and column in the visible range.
        // if it is, update the marker position.
        // if it is not lave it as invisible.

        const visibleRows = pageDetails.visibleRows;
        const rowIsVisible = this.#selection.row >= visibleRows.start && this.#selection.row <= visibleRows.end;
        const visibleColumns = pageDetails.visibleColumns;
        const columnIsVisible =
            (this.#selection.column >= visibleColumns.start && this.#selection.column <= visibleColumns.end) ||
            this.#selection.column < this.#config.frozenColumns?.count;

        if (rowIsVisible && columnIsVisible) {
            await this.#updateMarkerPosition();
        }
    }

    #updateAABBCallback(aabb) {
        this.#cellAABB = aabb;
    }

    #disposeDragMarker() {
        this._markerDragManager?.dispose();
        delete this._markerDragManager;
        delete this.#selection.toColumn;
        delete this.#selection.toRow;
    }

    async load() {
        requestAnimationFrame(async () => {
            this.setAttribute("tabindex", "0");
            this.#ctx = initialize(this.shadowRoot, this.offsetWidth, this.offsetHeight);
            this.addEventListener("click", this.#onMouseEventHandler);
            this.addEventListener("dblclick", this.#onMouseEventHandler);
            this.addEventListener("keydown", this.#onKeyDownHandler);
            this.addEventListener("mousedown", this.#startDragHandler);

            this.#scrollElement = this.shadowRoot.querySelector("#scroller");
            this.#scrollMarkerElement = this.shadowRoot.querySelector("#marker");

            await crsbinding.events.emitter.on("matrix-editing-removed", this.#focusHandler);

            // set up hovering
            this.#hoverManager.initialize(this);
            this.#hoverManager.addEventListener("hover", this.#hoverHandler);

            await crs.call("component", "notify_ready", { element: this });
        })
    }

    calculateGroupSizes() {
        const groupWidthValues = getGroupsSize(this.#config, this.#columnSizes);

        if (groupWidthValues != null) {
            this.#groupSizes = new SizesManager(this.#config.groups.length, 0, groupWidthValues);
        }
    }

    refresh() {
        const pageDetails = this.#getPageDetails();
        renderCanvas(this.#ctx, this.#config, pageDetails, this.#renderLT, this.#scrollLeft, this.#scrollTop, false);

        this.#overlayManager?.update(
            OverlayChanges.COLUMNS,
            this,
            this.#config,
            pageDetails,
            this.#scrollLeft,
            this.#scrollTop);

        moveScrollMarker(this.#scrollMarkerElement, this.#columnSizes, this.#rowSizes, this.#config);

        return pageDetails;
    }

    async initialize(config) {
        this.#scrollElement.removeEventListener("scroll", this.#onScrollHandler);

        try {
            await this.#disposeParts();
            this.#config = config;
            this.#config.columns = Columns.from(this.#config.columns);
            this.#config.rows = await crs.call("data_manager", "get_all", { manager: this.#config.manager });
            this.#config.regions = Regions.from(this.#config);
            this.#config.images = {
                [DataType.BOOLEAN]: await BooleanImages.from(new URL("./images/boolean/", import.meta.url))
            }

            this.#rowSizes = new SizesManager(this.#config.rows.length, this.#config.heights.row);

            const columnWidthValues = this.#config.columns.map(column => column.width);
            this.#columnSizes = new SizesManager(this.#config.columns.length, 0, columnWidthValues);

            this.calculateGroupSizes();
            this.#getFrozenDetails();

            // 4. move marker to the bottom right corner to enable scrolling
            moveScrollMarker(this.#scrollMarkerElement, this.#columnSizes, this.#rowSizes, this.#config);

            const canvasBottom = this.#config.regions.cells.bottom;
            const contentBottom = this.#config.regions.cells.top + this.#rowSizes.totalSize;
            this.#config.regions.cells.bottom = Math.min(canvasBottom, contentBottom);

            // 5. render the canvas
            const pageDetails = this.refresh();

            const overlayElement = this.shadowRoot.querySelector("#overlay");
            this.#overlayManager = new OverlayManager(overlayElement, this.#config.overlay);

            this.#overlayManager.update(
                OverlayChanges.COLUMNS | OverlayChanges.ROWS,
                this,
                this.#config,
                pageDetails,
                this.#scrollLeft,
                this.#scrollTop);

            await this.#updateMarkerPosition();

            // 6. register for changes on data manager
            await crs.call("data_manager", "on_change", {
                manager: this.#config.manager,
                callback: this.#dataManagerChangedHandler
            });

            this.focus();
        }
        catch(error) {
            console.error(error);
        }
        finally {
            this.#scrollElement.addEventListener("scroll", this.#onScrollHandler);
        }
    }

    getSelectedColumnIndex(event) {
        const isInFrozenZone = event.offsetX < (this.#config.regions.frozenColumns?.right ?? 0);

        const x = isInFrozenZone ? event.offsetX : event.offsetX + this.#scrollLeft;
        let selectedColumn = this.#columnSizes.getIndex(x);

        if (selectedColumn === -1) {
            selectedColumn = this.#selection.column;
        }

        return selectedColumn;
    }

    getSelectedRowIndex(event) {
        const y = this.#scrollTop + event.offsetY - this.#config.regions.cells.top;
        let selectedRow = this.#rowSizes.getIndex(y);

        if (selectedRow === -1) {
            selectedRow = this.#selection.row;
        }

        return selectedRow;
    }

    async select(event) {
        // multi is set by the drag marker
        // if we are doing a multi selection we don't want to override this.
        // when we click again though we do so we need to remove the multi flag.
        if (this.#selection.multi === true) {
            await this.copyOverSelectedValues();
            delete this.#selection.multi;
            return;
        }

        this.#disposeDragMarker();

        this.#selection.row = this.getSelectedRowIndex(event);
        this.#selection.column = this.getSelectedColumnIndex(event);

        await this.#updateMarkerPosition();

        const isInFrozenZone = event.offsetX < (this.#config.regions.frozenColumns?.right ?? 0);
        if (isInFrozenZone === false) {
            await this.#ensureMarkerVisible();
        }
    }

    async selectLeft() {
        if (this.#selection.column === 0) {
            return;
        }

        this.#selection.column = Math.max(this.#selection.column - 1, 0);
        this.#disposeDragMarker();

        await this.#updateMarkerPosition();

        const isInFrozenZone = this.#selection.column < this.#config.frozenColumns?.count ?? 0;

        if (!isInFrozenZone) {
            await this.#ensureMarkerVisible();
        }
    }

    async selectRight() {
        if (this.#selection.column === this.#columnSizes.length - 1) {
            return;
        }

        this.#selection.column = this.#selection.toColumn ?? this.#selection.column;
        this.#disposeDragMarker();

        const frozenCount = this.#config.frozenColumns?.count ?? 0;
        const isInFrozenZone = this.#selection.column < frozenCount;
        const isLastFrozenZone = this.#selection.column === frozenCount - 1;

        // if the current selected column is the last frozen column, and you select right
        // but there is scrolling, instead of selecting the next column, select the next visible column.
        if (isLastFrozenZone) {
            const x = this.#scrollLeft + this.#config.regions.frozenColumns.right + 1;
            this.#selection.column = this.#columnSizes.getIndex(x);
        }
        else {
            this.#selection.column = Math.min(this.#selection.column + 1, this.#columnSizes.length - 1);
        }

        // we are currently navigating in the frozen zone so we don't need to do page scrolling.
        if (!isInFrozenZone) {
            const pageDetails = this.#getPageDetails();

            if (this.#selection.column > pageDetails.visibleColumns.end - 1) {
                this.#scrollElement.scrollLeft += this.#columnSizes.at(this.#selection.column);
                renderCanvas(this.#ctx, this.#config, pageDetails, this.#renderLT, this.#scrollLeft, this.#scrollTop, true);
            }
        }

        await this.#updateMarkerPosition();

        if (!isInFrozenZone || isLastFrozenZone) {
            await this.#ensureMarkerVisible();
        }
    }

    async selectUp() {
        if (this.#selection.row === 0) {
            return;
        }

        this.#disposeDragMarker();
        this.#selection.row = Math.max(this.#selection.row - 1, 0);

        await this.#updateMarkerPosition();
        await this.#ensureMarkerVisible();
    }

    async selectDown() {
        if (this.#selection.row === this.#rowSizes.length - 1) {
            return;
        }

        this.#selection.row = this.#selection.toRow ?? this.#selection.row;

        this.#disposeDragMarker();
        this.#selection.row = Math.min(this.#selection.row + 1, this.#rowSizes.length - 1);

        const pageDetails = this.#getPageDetails();

        if (this.#selection.row > pageDetails.visibleRows.end - 1) {
            this.#scrollElement.scrollTop += this.#rowSizes.at(this.#selection.row);
            renderCanvas(this.#ctx, this.#config, pageDetails, this.#renderLT, this.#scrollLeft, this.#scrollTop, true);
        }

        await this.#updateMarkerPosition();
        await this.#ensureMarkerVisible();
    }

    async selectPageUp() {
        this.#scrollElement.scrollTop -= this.#config.regions.cells.height;
    }

    async selectPageDown() {
        this.#scrollElement.scrollTop += this.#config.regions.cells.height;
    }

    async selectRowHome() {
        this.#selection.column = 0;
        this.#scrollElement.scrollLeft = 0;
        await this.#updateMarkerPosition();
    }

    async selectRowEnd() {
        this.#selection.column = this.#config.columns.length - 1;
        this.#scrollElement.scrollLeft = this.#scrollElement.scrollWidth - this.#scrollElement.clientWidth;
        await this.#updateMarkerPosition();
    }

    async selectRange(event) {
        const column = this.getSelectedColumnIndex(event);
        const row = this.getSelectedRowIndex(event);

        if (column === this.#selection.column) {
            this.#selection.toRow = row;
        }
        else if (row === this.#selection.row) {
            this.#selection.toColumn = column;
        }

        this.#overlayManager.update(OverlayChanges.MULTI_SELECTION, this, this.#config, {selection: this.#selection});
    }

    async selectAppend(event) {
        // you can either resize the column or the row, not both at the same time.
        // if we already started selecting a column, we can't select a row.
        // you are commited to either horizontal or vertical selection not both.
        if (event.code === "ArrowRight") {
            if (this.#selection.toRow == null) {
                this.#selection.toColumn = (this.#selection.toColumn ?? this.#selection.column) + 1;
            }
        }
        else if (event.code === "ArrowDown") {
            if (this.#selection.toColumn == null) {
                this.#selection.toRow = (this.#selection.toRow ?? this.#selection.row) + 1;
            }
        }

        this.#overlayManager.update(OverlayChanges.MULTI_SELECTION, this, this.#config, {selection: this.#selection});
    }

    async selectPop(event) {
        if (event.code === "ArrowLeft" && this.#selection.toColumn != null) {
            this.#selection.toColumn = (this.#selection.toColumn ?? this.#selection.column) - 1;

            if (this.#selection.toColumn <= this.#selection.column) {
                delete this.#selection.toColumn;
            }
        }
        else if (event.code === "ArrowUp" && this.#selection.toRow != null) {
            this.#selection.toRow = (this.#selection.toRow ?? this.#selection.row) - 1;

            if (this.#selection.toRow <= this.#selection.row) {
                delete this.#selection.toRow;
            }
        }

        this.#overlayManager.update(OverlayChanges.MULTI_SELECTION, this, this.#config, {selection: this.#selection});
    }

    async home() {
        this.#selection.row = 0;
        this.#selection.column = 0;
        this.#scrollElement.scrollLeft = 0;
        this.#scrollElement.scrollTop = 0;
        await this.#updateMarkerPosition();
    }

    async end() {
        this.#selection.row = this.#config.rows.length - 1;
        this.#selection.column = 0;
        this.#scrollElement.scrollLeft = 0;
        this.#scrollElement.scrollTop = this.#scrollElement.scrollHeight - this.#scrollElement.clientHeight;
        await this.#updateMarkerPosition();
    }

    async editCell() {
        if (this.#selection.toColumn != null || this.#selection.toRow != null) {
            return await this.copyOverSelectedValues();
        }

        const column = this.#config.columns[this.#selection.column];
        column.index = this.#selection.column;

        if (column.editable === true) {
            this.#editorLT[column.type](this.#ctx, this.#config, this.#selection.row, column, this.#cellAABB, this.shadowRoot);

            // if a tooltip is active, remove it so that we can see the input
            await crsbinding.events.emitter.emit("tooltip", {
                action: "hide"
            })
        }
    }

    async editRow() {
        this.dispatchEvent(new CustomEvent("edit-row", {
            detail: {
                row: this.#selection.row,
                manager: this.#config.manager
            }
        }));
    }

    async copyOverSelectedValues(copyValue) {
        const copyColumn = this.#config.columns[this.#selection.column];
        const copyField = copyColumn.field;
        const copyDataType = copyColumn.type;
        this.#copyValue = copyValue ?? this.#config.rows[this.#selection.row][copyField];

        if (this.#selection.toRow != null) {
            for (let rowIndex = this.#selection.row; rowIndex <= this.#selection.toRow; rowIndex++) {
                crs.call("data_manager", "update", {
                    manager: this.#config.manager,
                    index: rowIndex,
                    changes: {
                        [copyField]: this.#copyValue
                    }
                })
            }
        }
        else {
            for (let columnIndex = this.#selection.column; columnIndex <= this.#selection.toColumn; columnIndex++) {
                const targetColumn = this.#config.columns[columnIndex];
                const field = targetColumn.field;
                const dataType = targetColumn.type;

                if (dataType === copyDataType) {
                    crs.call("data_manager", "update", {
                        manager: this.#config.manager,
                        index: this.#selection.row,
                        changes: {
                            [field]: this.#copyValue
                        }
                    })
                }
            }
        }
    }

    async cut(event) {
        await this.copy(event);
        const field = this.#config.columns[this.#selection.column].field;

        await crs.call("data_manager", "update", {
            manager: this.#config.manager,
            index: this.#selection.row,
            changes: {
                [field]: null
            }
        })
    }

    async copy(event) {
        const column = this.#config.columns[this.#selection.column];
        const field = column.field;
        this.#copyDataType = column.type;
        this.#copyValue = this.#config.rows[this.#selection.row][field];

        await crs.call("system", "copy_to_clipboard", {
            source: this.#copyValue
        })
    }

    async paste(event) {
        if (this.#selection.toRow != null || this.#selection.toColumn != null) {
            return await this.copyOverSelectedValues(this.#copyValue);
        }

        const column = this.#config.columns[this.#selection.column];
        const field = column.field;

        // if the column is not of the same data type as the copy don't do anything.
        if (column.type !== this.#copyDataType) return;

        await crs.call("data_manager", "update", {
            manager: this.#config.manager,
            index: this.#selection.row,
            changes: {
                [field]: this.#copyValue
            }
        })
    }
}

function getGroupsSize(config, columnSizes) {
    if (config.groups == null) {
        return null;
    }

    const groups = config.groups;
    const columns = config.columns;
    const result = [];

    for (const group of groups) {
        const fromIndex = group.from;
        const toIndex = group.to ?? columns.length - 1;

        const width = columnSizes.sizeBetween(fromIndex, toIndex);
        result.push(width);
    }

    return result;
}

/**
 * Move the marker element to a location that represents the actual size of the content.
 * This will enable scrolling in the scroller element.
 * @param element (HTMLElement) - The element to move
 * @param columnSizes (SizesManager) - The column sizes manager
 * @param rowSizes (SizesManager) - The row sizes manager
 * @param config
 */
function moveScrollMarker(element, columnSizes, rowSizes, config) {
    const x = columnSizes.totalSize;
    const y = rowSizes.totalSize + config.regions.cells.top;

    element.style.translate = `${x}px ${y}px`;
}

customElements.define("matrix-renderer", MatrixRenderer);

export { Align, DataType };