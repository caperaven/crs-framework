/**
 * @class SlaVisualization - This class is responsible for rendering the SLA visualization.
 * @extends crs.classes.BindableElement
 *
 *
 **/

export class SlaLayer extends HTMLElement {

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        const html = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());
        this.shadowRoot.innerHTML = html;
        this.dispatchEvent(new CustomEvent("loading"));
    }

    async disconnectedCallback() {
    }
}

customElements.define("sla-layer", SlaLayer);