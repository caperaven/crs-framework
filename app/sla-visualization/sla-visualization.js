import "../../components/sla-visualization/sla-visualization-actions.js";
import {data} from "./data.js";

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

    }

    async initialize() {
        await crs.call("sla_visualization", "initialize", {
            element: this.shadowRoot.querySelector("#sla-visualization"),
            data: data
        })
    }
}