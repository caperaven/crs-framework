/**
 * @class SlaVisualization - This class is responsible for rendering the SLA visualization.
 * @extends crs.classes.BindableElement
 *
 *
 **/
import {loadHTML} from "./../../dist/src/load-resources.js";
export class SlaVisualization extends crs.classes.BindableElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        super.connectedCallback();
        this.shadowRoot.innerHTML = await loadHTML(import.meta.url);
    }
}

customElements.define("sla-visualization", SlaVisualization);