/**
 * @class SlaVisualization - This class is responsible for rendering the SLA visualization.
 * @extends crs.classes.BindableElement
 *
 *
 **/
import {loadHTML} from "../../src/load-resources.js";

export class SlaVisualization extends crs.classes.BindableElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        super.connectedCallback();
        this.shadowRoot.innerHTML = await loadHTML(import.meta.url);
        await this.load();
    }

    async load() {
        return new Promise(resolve => {
            requestAnimationFrame(async () => {
                console.log("the sla-visualization element is loaded");

                await crs.call("component", "notify_ready", { element: this });
                resolve();
            });
        });
    }

    async disconnectedCallback() {
        super.disconnectedCallback();
    }
}

customElements.define("sla-visualization", SlaVisualization);