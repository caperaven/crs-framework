/**
 * @class SlaVisualization - This class is responsible for rendering the SLA visualization.
 * @extends crs.classes.BindableElement
 *
 *
 **/
import {loadHTML} from "./../../../dist/src/load-resources.js";

export class SlaLayer extends crs.classes.BindableElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        super.connectedCallback();
        this.shadowRoot.innerHTML = await loadHTML(import.meta.url);
        this.dispatchEvent(new CustomEvent("loading"));
    }

    async disconnectedCallback() {
        super.disconnectedCallback();
    }
}

customElements.define("sla-layer", SlaLayer);