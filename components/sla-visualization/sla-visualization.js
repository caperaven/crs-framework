/**
 * @class SlaVisualization - This class is responsible for rendering the SLA visualization.
 * @extends crs.classes.BindableElement
 *
 *
 **/
export class SlaVisualization extends crsbinding.classes.BindableElement {

    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async connectedCallback() {
        super.connectedCallback();
    }

    async disconnectedCallback() {
        super.disconnectedCallback();
    }
}

customElements.define("sla-visualization", SlaVisualization);