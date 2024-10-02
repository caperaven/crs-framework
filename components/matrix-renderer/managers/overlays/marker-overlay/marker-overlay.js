class MarkerOverlay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    async connectedCallback() {
        const html = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${import.meta.url.replace(".js", ".css")}">
            ${html}`;
    }
}

customElements.define('marker-overlay', MarkerOverlay);