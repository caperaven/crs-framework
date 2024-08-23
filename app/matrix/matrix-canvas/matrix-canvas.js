import {GridData} from "../../../src/managers/grid-data/grid-data.js";
import {createMarker} from "./marker.js";
import {canvasInit} from "./canvas-init.js";
import {drawOutline} from "./drawing/outline.js";

export default class MatrixCanvas extends crs.classes.BindableElement {
    #fields;
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

    load() {
        return new Promise(resolve => {
            const scroller = this.shadowRoot.querySelector(".scroller");
            this.registerEvent(scroller, "scroll", this.#scrollHandler);

            requestAnimationFrame(() => {
                this.#ctx = canvasInit(this.shadowRoot.querySelector("canvas"));
                resolve();
            });
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

        drawOutline(this.#ctx, this.#scrollLeft, this.#scrollTop, this.#gridData);
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
        createMarker(this.shadowRoot.querySelector(".scroller"), this.#gridData);

        drawOutline(this.#ctx, 0, 0, this.#gridData);
    }
}

customElements.define("matrix-canvas", MatrixCanvas);

