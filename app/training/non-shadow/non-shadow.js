class NonShadowComponent extends HTMLElement {
    static get observedAttributes() {
        return ["title"];
    }

    async connectedCallback() {
        const html = await fetch(import.meta.url.replace(".js", ".html")).then(r => r.text());
        this.innerHTML = html;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(name, newValue);
    }
}
customElements.define("non-shadow-comp", NonShadowComponent);