/**
 * @class SlaVisualization - This component is responsible for rendering the SLA Layer on the SLA Visualization
 *
 **/

export class SlaLayer extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        const html = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());
        const css = `<link rel="stylesheet" href="${import.meta.url.replace(".js", ".css")}">`;
        this.shadowRoot.innerHTML = `${css}${html}`;
        this.dataset.status = "ready";
        this.dispatchEvent(new CustomEvent("sla-layer-loaded"));
    }

    async disconnectedCallback() {
    }
}

customElements.define("sla-layer", SlaLayer);