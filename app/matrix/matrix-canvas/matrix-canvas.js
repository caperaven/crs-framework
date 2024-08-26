import {GridData} from "../../../src/managers/grid-data/grid-data.js";
import {canvasInit} from "./canvas-init.js";
import {drawOnCanvas} from "./drawing/draw-on-canvas.js";

export default class MatrixCanvas extends crs.classes.BindableElement {
    #gridData;
    #ctx;
    #animating = false;
    #scrollHandler = this.#scroll.bind(this);
    #scrollLeft = 0;
    #scrollTop = 0;
    #oldScrollLeft = 0;
    #oldScrollTop = 0;
    #rows;
    #columns;

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    get hasStyle() {
        return true;
    }

    async connectedCallback() {
        await super.connectedCallback();
        const scroller = this.shadowRoot.querySelector(".scroller");
        this.registerEvent(scroller, "scroll", this.#scrollHandler);

        requestAnimationFrame(async () => {
            await crs.call("component", "on_ready", {element: this, callback: this.onReady, caller: this})
        })
    }

    onReady() {
        requestAnimationFrame(() => {
            const width = this.offsetWidth;
            const height = this.offsetHeight;
            this.#ctx = canvasInit(this.shadowRoot, width, height, this.#gridData);

            if (this.#gridData != null) {
                drawOnCanvas(this.#ctx, 0, 0, this.#gridData, this.#columns, this.#rows);
            }
        })
    }

    async disconnectedCallback() {
        this.#scrollHandler = null;
        this.#rows = null;
        this.#columns = null;
        super.disconnectedCallback();
    }

    #animate() {
        if (this.#scrollLeft === this.#oldScrollLeft && this.#scrollTop === this.#oldScrollTop) {
            this.#animating = false;
            return;
        }

        if (this.#animating) {
            requestAnimationFrame(() => {
                this.#animate();
            });
        }

        drawOnCanvas(this.#ctx, this.#scrollLeft, this.#scrollTop, this.#gridData, this.#columns, this.#rows);
        this.#oldScrollLeft = this.#scrollLeft;
        this.#oldScrollTop = this.#scrollTop;
    }

    async #scroll(event) {
        this.#scrollLeft = event.target.scrollLeft;
        this.#scrollTop = event.target.scrollTop;

        if (!this.#animating) {
            this.#animating = true;
            this.#animate();
        }
    }

    async setData(def) {
        const rows = def.rows;
        const columns = def.columns;
        const columnWidth = def.columnWidth;
        const rowHeight = def.rowHeight;
        const columnGroups = def.columnGroups;

        this.#rows = rows;
        this.#columns = columns;

        this.#gridData = new GridData(rows.length, rowHeight, columns.length, columnWidth);
        this.#gridData.setColumnGroups(columnGroups);

        if (this.#ctx != null) {
            drawOnCanvas(this.#ctx, 0, 0, this.#gridData, this.#columns, this.#rows);
        }
    }
}

customElements.define("matrix-canvas", MatrixCanvas);

