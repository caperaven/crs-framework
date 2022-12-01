class ShadowComponent extends HTMLElement {
    async connectedCallback() {
        this.attachShadow({mode: "open"});
        const html = await fetch(import.meta.url.replace(".js", ".html")).then(r => r.text());
        this.shadowRoot.innerHTML = html;
    }
}
customElements.define("shadow-comp", ShadowComponent);