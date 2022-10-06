class InputComposite extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());

        requestAnimationFrame(() => {
            this.shadowRoot.querySelector("#title").textContent = this.dataset.title;
        })
    }
}

customElements.define("input-composite", InputComposite);