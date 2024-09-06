import {initialize} from "./canvas-initialize.js";
import {Columns, Align, DataType} from "./columns.js";
import {Regions} from "./factories/regions-factory.js";
import {SizesManager} from "./../../src/managers/grid-data-managers/sizes-manager.js";
import {renderCanvas, createRenderLT} from "./renderers/render.js";

class MatrixRenderer extends HTMLElement {
    #ctx;
    #config;
    #columnSizes;
    #rowSizes;
    #animating = false;
    #scrollLeft = 0;
    #scrollTop = 0;
    #oldScrollLeft = 0;
    #oldScrollTop = 0;
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
        this.#rowSizes = this.#rowSizes.dispose();
        this.#columnSizes = this.#columnSizes.dispose();
        this.#onScrollHandler = null;
        this.#animateHandler = null;
        this.#renderLT = null;
    }

    #animate() {
        if (this.#animating) {
            requestAnimationFrame(this.#animateHandler);
        }

        // if I am not scrolling stop the animation loop
        if (this.#scrollLeft === this.#oldScrollLeft && this.#scrollTop === this.#oldScrollTop) {
            this.#animating = false;
            return;
        }

        const pageDetails = this.#getPageDetails();
        renderCanvas(this.#ctx, this.#config, pageDetails, this.#renderLT, this.#scrollLeft, this.#scrollTop);

        // update the old scroll values
        this.#oldScrollLeft = this.#scrollLeft;
        this.#oldScrollTop = this.#scrollTop;
    }

    #onScroll(event) {
        this.#scrollLeft = Math.ceil(event.target.scrollLeft);
        this.#scrollTop = Math.ceil(event.target.scrollTop);

        if (!this.#animating) {
            this.#animating = true;
            this.#animate();
        }
    }

    #getPageDetails() {
        const visibleColumns = this.#columnSizes.getVisibleRange(this.#scrollLeft, this.#ctx.canvas.width);
        const visibleRows = this.#rowSizes.getVisibleRange(this.#scrollTop, this.#ctx.canvas.height);

        const columnsActualSizes = [];
        const columnsCumulativeSizes = [];
        const rowsActualSizes = [];
        const rowsCumulativeSizes = [];

        for (let i = visibleColumns.start; i <= visibleColumns.end; i++) {
            columnsActualSizes.push(this.#columnSizes.at(i));
            columnsCumulativeSizes.push(this.#columnSizes.cumulative(i));
        }

        for (let i = visibleRows.start; i <= visibleRows.end; i++) {
            rowsActualSizes.push(this.#rowSizes.at(i));
            rowsCumulativeSizes.push(this.#rowSizes.cumulative(i));
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

        // 3. move marker to the bottom right corner to enable scrolling
        const markerElement = this.shadowRoot.querySelector("#marker");
        moveScrollMarker(markerElement, this.#columnSizes, this.#rowSizes);

        // 4. render the canvas
        const pageDetails = this.#getPageDetails();
        renderCanvas(this.#ctx, this.#config, pageDetails, this.#renderLT, this.#scrollLeft, this.#scrollTop);
    }
}

/**
 * Move the marker element to a location that represents the actual size of the content.
 * This will enable scrolling in the scroller element.
 * @param element (HTMLElement) - The element to move
 * @param columnSizes (SizesManager) - The column sizes manager
 * @param rowSizes (SizesManager) - The row sizes manager
 */
function moveScrollMarker(element, columnSizes, rowSizes) {
    const x = columnSizes.totalSize;
    const y = rowSizes.totalSize + rowSizes.defaultSize;

    element.style.translate = `${x}px ${y}px`;
}

customElements.define("matrix-renderer", MatrixRenderer);

export { Align, DataType };