/**
 * @class SlaVisualization - This class is responsible for rendering the SLA visualization.
 * @extends crs.classes.BindableElement
 *
 *
 **/

export class SlaLayer extends crsbinding.classes.BindableElement {

    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async connectedCallback() {
        await super.connectedCallback();
        this.dispatchEvent(new CustomEvent("loading"));
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
    }
}

customElements.define("sla-layer", SlaLayer);