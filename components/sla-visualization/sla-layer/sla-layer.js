/**
 * @class SlaVisualization - This class is responsible for rendering the SLA visualization.
 * @extends crs.classes.BindableElement
 *
 *
 **/
import {loadHTML} from "../../../src/load-resources.js";

export class SlaLayer extends crs.classes.BindableElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        super.connectedCallback();
        this.shadowRoot.innerHTML = await loadHTML(import.meta.url);
        await this.load()
    }

    async load() {
        return new Promise(resolve => {
            requestAnimationFrame(async () => {
                this.dataset.status = "loading";
                this.dispatchEvent(new CustomEvent("loading"));
                resolve();
            });
        });
    }
}

customElements.define("sla-layer", SlaLayer);