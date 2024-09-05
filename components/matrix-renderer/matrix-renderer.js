import {initialize} from "./canvas-initialize.js";
import {Columns, Align, DataType} from "./columns.js";
import {Regions} from "./factories/regions-factory.js";
import {SizesManager} from "./../../src/managers/grid-data-managers/sizes-manager.js";
import {renderCanvas} from "./renderers/render-canvas.js";

const FPS = 60;
const INTERVAL = 1000 / FPS;

class MatrixRenderer extends HTMLElement {
    #ctx;
    #config;
    #columnSizes;
    #rowSizes;
    #lastTime = 0;
    #animating = false;
    #scrollLeft;
    #scrollTop;
    #oldScrollLeft;
    #oldScrollTop;
    #onScrollHandler = this.#onScroll.bind(this);
    #animateHandler = this.#animate.bind(this);

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
        scrollElement.addEventListener("scroll", this.#onScrollHandler);

        this.#ctx = null;
        this.#config = null;
        this.#rowSizes = this.#rowSizes.dispose();
        this.#columnSizes = this.#columnSizes.dispose();
        this.#onScrollHandler = null;
        this.#animateHandler = null;
    }

    #animate(currentTime) {
        if (this.#animating) {
            requestAnimationFrame(this.#animateHandler);
        }

        // if I am not scrolling stop the animation loop
        if (this.#scrollLeft === this.#oldScrollLeft && this.#scrollTop === this.#oldScrollTop) {
            this.#animating = false;
            return;
        }

        // apply throttling so that we only call it at 60fps
        const deltaTime = currentTime - this.#lastTime;
        if (deltaTime < INTERVAL) {
            this.#lastTime = currentTime - (deltaTime % INTERVAL);
            renderCanvas(this.#ctx, this.#config, this.#scrollLeft, this.#scrollTop);
        }

        // update the old scroll values
        this.#oldScrollLeft = this.#scrollLeft;
        this.#oldScrollTop = this.#scrollTop;
    }

    #onScroll(event) {
        this.#scrollLeft = Math.ceil(event.target.scrollLeft);
        this.#scrollTop = Math.ceil(event.target.scrollTop);

        if (!this.#animating) {
            this.#lastTime = 0;
            this.#animating = true;
            this.#animate();
        }
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