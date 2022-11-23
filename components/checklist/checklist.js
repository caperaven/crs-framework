export class Checklist extends HTMLElement {
    #clickHandler = this.#clicked.bind(this);

    get clickedHandler() {
        return this.#clickHandler;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get selected() {
        //returns all selected items
    }

    constructor() {
        super();
        this.attachShadow({mode:"open"});
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch(this.html).then(result => result.text());
        await this.load();

    }

    async disconnectedCallback() {
        await this.shadowRoot.removeEventListener("click",this.#clickHandler);
        this.#clickHandler = null;
    }

    async load() {
        await crsbinding.translations.parseElement(this);

        requestAnimationFrame(() => {
            this.shadowRoot.addEventListener("click", this.#clickHandler);
        })
    }

    async #clicked(event) {

    }
}

customElements.define("check-list", Checklist);