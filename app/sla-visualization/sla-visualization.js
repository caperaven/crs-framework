import "../../components/sla-visualization/sla-visualization-actions.js";
import "../../components/sla-visualization/sla-layer/sla-layer-actions.js";
import "../../components/sla-visualization/sla-measurement/sla-measurement-actions.js";
import {data1, data2} from "./data.js";

export default class SlaVisualization extends crs.classes.BindableElement {

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async connectedCallback() {
        await super.connectedCallback();

    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
    }

    async initializeRuntime() {
        await crs.call("sla_visualization", "initialize", {
            element: this.shadowRoot.querySelector("sla-visualization#runtime"),
            phase : this.shadowRoot.querySelector("sla-visualization#runtime").dataset.phase,
            data: data1
        })
    }

    async initializeSetup() {
        await crs.call("sla_visualization", "initialize", {
            element: this.shadowRoot.querySelector("sla-visualization#setup"),
            phase : this.shadowRoot.querySelector("sla-visualization#setup").dataset.phase,
            data: data2
        })
    }

    async removeMeasurement() {
        const parentElement = this.shadowRoot.querySelector("sla-visualization#setup");
        await crs.call("sla_measurement", "remove_measurement", {
            element: parentElement
        })
    }
}