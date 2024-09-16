import {initialize} from "./canvas-initialize.js";
import {Columns, Align, DataType} from "./columns.js";
import {Regions} from "./factories/regions-factory.js";
import {BooleanImages} from "./factories/boolean-images-factory.js";
import {SizesManager} from "../../src/managers/grid-data-managers/sizes-manager.js";
import {InputManager} from "./managers/input-manager.js";
import {renderCanvas, createRenderLT} from "./renderers/render.js";
import {createEditorLT} from "./editors/editor.js";
import {setCellAABB, setFrozenAABB} from "./aabb/aabb.js";
import {setCellMarker} from "./dom/cell-marker.js"

class MatrixRenderer extends HTMLElement {
    #ctx;
    #scrollElement;
    #config;
    #groupSizes;
    #columnSizes;
    #rowSizes;
    #animating = false;
    #scrollLeft = 0;
    #scrollTop = 0;
    #lastTime = 0;
    #inputManager = new InputManager();
    #dataManagerChangedHandler = this.#dataManagerChange.bind(this);
    #onScrollHandler = this.#onScroll.bind(this);
    #onMouseEventHandler = this.#onMouseEvent.bind(this);
    #onKeyDownHandler = this.#onKeyDown.bind(this);
    #animateHandler = this.#animate.bind(this);
    #focusHandler = this.#focus.bind(this);
    #renderLT = createRenderLT();
    #editorLT = createEditorLT();
    #cellAABB = { x1: 0, x2: 0, y1: 0, y2: 0 };
    #markerElement;
    #selection = {
        row: 0,
        column: 0
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.style.display  = "block";
        this.style.width    = "100%";
        this.style.height   = "100%";
        this.style.position = "relative";
        this.style.overflow = "hidden";
        this.style.willChange = "transform";
        this.setAttribute("tabindex", 0);
    }

    async connectedCallback() {
        await this.load();
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

        this.removeEventListener("click", this.#onMouseEventHandler);
        this.removeEventListener("dblclick", this.#onMouseEventHandler);
        this.removeEventListener("keydown", this.#onKeyDownHandler);

        this.#ctx = null;
        this.#config = null;
        this.#groupSizes = this.#groupSizes.dispose();
        this.#rowSizes = this.#rowSizes.dispose();
        this.#columnSizes = this.#columnSizes.dispose();
        this.#onScrollHandler = null;
        this.#animateHandler = null;
        this.#renderLT = null;
        this.#markerElement = null;
        this.#inputManager = this.#inputManager.dispose();
        this.#selection = null;
    }

    #focus() {
        this.focus();
    }

    #animate(currentTime) {
        const pageDetails = this.#getPageDetails();
        renderCanvas(this.#ctx, this.#config, pageDetails, this.#renderLT, this.#scrollLeft, this.#scrollTop, false);

        // if we stop scrolling render the final frame
        const deltaTime = currentTime - this.#lastTime;
        if (deltaTime > 10) {
            this.#animating = false;
            renderCanvas(this.#ctx, this.#config, pageDetails, this.#renderLT, this.#scrollLeft, this.#scrollTop, true);
            return;
        }

        if (this.#animating) {
            requestAnimationFrame(this.#animateHandler);
        }
    }

    #onScroll(event) {
        this.#lastTime = performance.now();
        this.#scrollLeft = Math.ceil(event.target.scrollLeft);
        this.#scrollTop = Math.ceil(event.target.scrollTop);

        if (!this.#animating) {
            this.#markerElement = this.#markerElement?.remove();
            this.#animating = true;
            this.#animate();
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


    #onClickHeader(event) {
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
        const visibleGroups = this.#groupSizes.getVisibleRange(this.#scrollLeft, this.#ctx.canvas.width - 16);
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

        for (let i = visibleGroups.start; i <= visibleGroups.end; i++) {
            groupsActualSizes.push(this.#groupSizes.at(i));
            groupsCumulativeSizes.push(this.#groupSizes.cumulative(i));
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
            rowLocation
        };
    }

    #dataManagerChange(args) {
        const pageDetails = this.#getPageDetails();
        renderCanvas(this.#ctx, this.#config, pageDetails, this.#renderLT, this.#scrollLeft, this.#scrollTop, true);
    }

    #updateMarkerPosition() {
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                const pageDetails = this.#getPageDetails();
                const visibleRowIndex = this.#selection.row - pageDetails.visibleRows.start;
                const isInFrozenZone = this.#selection.column < this.#config.frozenColumns.count;

                if (isInFrozenZone) {
                    setFrozenAABB(this.#cellAABB, this.#config, pageDetails, this.#selection.column, visibleRowIndex, this.#scrollTop);
                }
                else {
                    const visibleColumnIndex = this.#selection.column - pageDetails.visibleColumns.start;
                    setCellAABB(this.#cellAABB, this.#config, pageDetails, visibleColumnIndex, visibleRowIndex, this.#scrollLeft, this.#scrollTop);
                }

                this.#markerElement = setCellMarker(this.#markerElement, this.shadowRoot, this.#cellAABB);
                resolve();
            })
        })
    }

    async #ensureMarkerVisible() {
        let changed = false;

        // Check for conditions to the right of the scrollable area
        if (this.#cellAABB.x2 > this.offsetWidth) {
            const diff = this.#cellAABB.x2 - this.offsetWidth;
            this.#scrollElement.scrollLeft += diff + 16;
            changed = true;
        }

        // check for conditions to the left referencing the frozen columns right edge
        if (this.#cellAABB.x1 < this.#config.regions.frozenColumns.right) {
            const diff = this.#config.regions.frozenColumns.right - this.#cellAABB.x1;
            this.#scrollElement.scrollLeft -= diff;
            changed = true;
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
            const pageDetails = this.#getPageDetails();
            renderCanvas(this.#ctx, this.#config, pageDetails, this.#renderLT, this.#scrollLeft, this.#scrollTop, true);
            await this.#updateMarkerPosition();
        }
    }

    async load() {
        requestAnimationFrame(async () => {
            this.#ctx = initialize(this.shadowRoot, this.offsetWidth, this.offsetHeight);
            this.addEventListener("click", this.#onMouseEventHandler);
            this.addEventListener("dblclick", this.#onMouseEventHandler);
            this.addEventListener("keydown", this.#onKeyDownHandler);

            this.#scrollElement = this.shadowRoot.querySelector("#scroller");
            this.#scrollElement.addEventListener("scroll", this.#onScrollHandler);

            await crsbinding.events.emitter.on("matrix-editing-removed", this.#focusHandler);
            await crs.call("component", "notify_ready", { element: this });
        })
    }

    async initialize(config) {
        // 1. saturate the config object with renderer data
        this.#config = config;
        this.#config.columns = Columns.from(this.#config.columns);
        this.#config.rows = await crs.call("data_manager", "get_all", { manager: this.#config.manager });
        this.#config.regions = Regions.from(this.#config);
        this.#config.images = {
            [DataType.BOOLEAN]: await BooleanImages.from(new URL("./images/boolean/", import.meta.url))
        }

        this.#config.errors = {
            "1,0": "Something went wrong"
        }

        // 2. initialize sizes for rendering
        // 2.1 calculate row sizes
        this.#rowSizes = new SizesManager(this.#config.rows.length, this.#config.heights.row);

        // 2.2 calculate column sizes
        this.columnWidthValues = this.#config.columns.map(column => column.width);
        this.#columnSizes = new SizesManager(this.#config.columns.length, 0, this.columnWidthValues);

        // 2.3 calculate group sizes
        const groupWidthValues = getGroupsSize(this.#config, this.#columnSizes);
        this.#groupSizes = new SizesManager(this.#config.groups.length, 0, groupWidthValues);

        // 3. get frozen details
        this.#getFrozenDetails();

        // 4. move marker to the bottom right corner to enable scrolling
        const markerElement = this.shadowRoot.querySelector("#marker");
        moveScrollMarker(markerElement, this.#columnSizes, this.#rowSizes, this.#config);

        // 5. render the canvas
        const pageDetails = this.#getPageDetails();
        renderCanvas(this.#ctx, this.#config, pageDetails, this.#renderLT, this.#scrollLeft, this.#scrollTop, true);

        await this.#updateMarkerPosition();

        // 6. register for changes on data manager
        await crs.call("data_manager", "on_change", {
            manager: this.#config.manager,
            callback: this.#dataManagerChangedHandler
        });

        this.focus();
    }

    async select(event) {
        const isInFrozenZone = event.offsetX < (this.#config.regions.frozenColumns?.right ?? 0);

        // 1. get the column and row values
        const y = this.#scrollTop + event.offsetY - this.#config.regions.cells.top;
        const x = isInFrozenZone ? event.offsetX : event.offsetX + this.#scrollLeft;

        this.#selection.row = this.#rowSizes.getIndex(y);
        this.#selection.column = this.#columnSizes.getIndex(x);

        await this.#updateMarkerPosition();
        await this.#ensureMarkerVisible();
    }

    async selectLeft(event) {
        if (this.#selection.column === 0) {
            return;
        }

        this.#selection.column = Math.max(this.#selection.column - 1, 0);

        if (this.#markerElement) {
            this.#markerElement.style.display = "none";
        }

        await this.#updateMarkerPosition();
        await this.#ensureMarkerVisible();

        this.#markerElement.style.display = "block";
    }

    async selectRight(event) {
        if (this.#selection.column === this.#columnSizes.length - 1) {
            return;
        }

        this.#selection.column = Math.min(this.#selection.column + 1, this.#columnSizes.length - 1);

        const pageDetails = this.#getPageDetails();

        if (this.#selection.column > pageDetails.visibleColumns.end - 1) {
            this.#scrollElement.scrollLeft += this.#columnSizes.at(this.#selection.column);
            renderCanvas(this.#ctx, this.#config, pageDetails, this.#renderLT, this.#scrollLeft, this.#scrollTop, true);
        }

        await this.#updateMarkerPosition();
        await this.#ensureMarkerVisible();
    }

    async selectUp(event) {
        if (this.#selection.row === 0) {
            return;
        }

        this.#selection.row = Math.max(this.#selection.row - 1, 0);

        if (this.#markerElement) {
            this.#markerElement.style.display = "none";
        }

        await this.#updateMarkerPosition();
        await this.#ensureMarkerVisible();

        this.#markerElement.style.display = "block";
    }

    async selectDown(event) {
        if (this.#selection.row === this.#rowSizes.length - 1) {
            return;
        }

        this.#selection.row = Math.min(this.#selection.row + 1, this.#rowSizes.length - 1);

        const pageDetails = this.#getPageDetails();

        if (this.#selection.row > pageDetails.visibleRows.end - 1) {
            this.#scrollElement.scrollTop += this.#rowSizes.at(this.#selection.row);
            renderCanvas(this.#ctx, this.#config, pageDetails, this.#renderLT, this.#scrollLeft, this.#scrollTop, true);
        }

        await this.#updateMarkerPosition();
        await this.#ensureMarkerVisible();
    }

    async selectPageUp(event) {

    }

    async selectPageDown(event) {

    }

    async selectRowHome(event) {
        this.#selection.column = 0;
        this.#scrollElement.scrollLeft = 0;
        await this.#updateMarkerPosition();
    }

    async selectRowEnd(event) {
        this.#selection.column = this.#config.columns.length - 1;
        this.#scrollElement.scrollLeft = this.#scrollElement.scrollWidth - this.#scrollElement.clientWidth;
        await this.#updateMarkerPosition();
    }

    async home(event) {
        this.#selection.row = 0;
        this.#selection.column = 0;
        this.#scrollElement.scrollLeft = 0;
        this.#scrollElement.scrollTop = 0;
        await this.#updateMarkerPosition();
    }

    async end(event) {
        this.#selection.row = this.#config.rows.length - 1;
        this.#selection.column = this.#config.columns.length - 1;
        this.#scrollElement.scrollLeft = this.#scrollElement.scrollWidth - this.#scrollElement.clientWidth;
        this.#scrollElement.scrollTop = this.#scrollElement.scrollHeight - this.#scrollElement.clientHeight;
        await this.#updateMarkerPosition();
    }

    async editCell(event) {
        const column = this.#config.columns[this.#selection.column];
        this.#editorLT[column.type](this.#ctx, this.#config, this.#selection.row, column, this.#cellAABB, this.shadowRoot);
    }

    async editRow(event) {
        this.dispatchEvent(new CustomEvent("edit-row", {
            detail: {
                row: this.#selection.row,
                manager: this.#config.manager
            }
        }));
    }
}

function getGroupsSize(config, columnSizes) {
    const groups = config.groups;
    const columns = config.columns;
    const result = [];

    let lastSize = 0;
    for (const group of groups) {
        const to = group.to ?? columns.length - 1;

        const sizeTo = columnSizes.cumulative(to);
        const size = sizeTo - lastSize;
        lastSize = size;
        result.push(size);
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