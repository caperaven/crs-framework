import {initialize} from "./canvas-initialize.js";
import {Columns, Align, DataType} from "./columns.js";
import {Regions} from "./factories/regions-factory.js";
import {SizesManager} from "./../../src/managers/grid-data-managers/sizes-manager.js";
import {renderCanvas, createRenderLT} from "./renderers/render.js";

class MatrixRenderer extends HTMLElement {
    #ctx;
    #config;
    #groupSizes;
    #columnSizes;
    #rowSizes;
    #animating = false;
    #scrollLeft = 0;
    #scrollTop = 0;
    #lastTime = 0;
    #onScrollHandler = this.#onScroll.bind(this);
    #animateHandler = this.#animate.bind(this);
    #renderLT = createRenderLT();

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.style.display  = "block";
        this.style.width    = "100%";
        this.style.height   = "100%";
        this.style.position = "relative";
    }

    async connectedCallback() {
        await this.load();
    }

    async disconnectedCallback() {
        const scrollElement = this.shadowRoot.querySelector("#scroller");
        scrollElement.removeEventListener("scroll", this.#onScrollHandler);

        this.#ctx = null;
        this.#config = null;
        this.#groupSizes = this.#groupSizes.dispose();
        this.#rowSizes = this.#rowSizes.dispose();
        this.#columnSizes = this.#columnSizes.dispose();
        this.#onScrollHandler = null;
        this.#animateHandler = null;
        this.#renderLT = null;
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
            this.#animating = true;
            this.#animate();
        }
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

    async load() {
        requestAnimationFrame(async () => {
            this.#ctx = initialize(this.shadowRoot, this.offsetWidth, this.offsetHeight);

            const scrollElement = this.shadowRoot.querySelector("#scroller");
            scrollElement.addEventListener("scroll", this.#onScrollHandler);

            await crs.call("component", "notify_ready", { element: this });
        })
    }

    async initialize(config) {
        // 1. saturate the config object with renderer data
        this.#config = config;
        this.#config.columns = Columns.from(this.#config.columns);
        this.#config.rows = await crs.call("data_manager", "get_all", { manager: this.#config.manager });
        this.#config.regions = Regions.from(this.#config);

        // 2. initialize sizes for rendering
        this.#columnSizes = new SizesManager(this.#config.columns.length, 100);
        this.#rowSizes = new SizesManager(this.#config.rows.length, this.#config.heights.row);
        this.#groupSizes = new SizesManager(this.#config.groups.length, 0, getGroupsSize(this.#config, this.#columnSizes));

        // 3. move marker to the bottom right corner to enable scrolling
        const markerElement = this.shadowRoot.querySelector("#marker");
        moveScrollMarker(markerElement, this.#columnSizes, this.#rowSizes, this.#config);

        // 4. render the canvas
        const pageDetails = this.#getPageDetails();
        renderCanvas(this.#ctx, this.#config, pageDetails, this.#renderLT, this.#scrollLeft, this.#scrollTop, true);
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