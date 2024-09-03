import {initialize} from "./canvas-initialize.js";

export class MatrixRenderer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.style.display = "block";
        this.style.width = "100%";
        this.style.height = "100%";
        this.style.position = "relative";
    }

    async connectedCallback() {
        await this.load();
    }

    async load() {
        requestAnimationFrame(async () => {
            initialize(this.shadowRoot, this.offsetWidth, this.offsetHeight);
            await crs.call("component", "notify_ready", { element: this });
        })
    }
}

customElements.define("matrix-renderer", MatrixRenderer);