export class Checklist extends HTMLElement {
    #clickHandler = this.#clicked.bind(this);

    get clickedHandler() {
        return this.#clickHandler;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
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
        requestAnimationFrame(async () => {
            await crsbinding.translations.parseElement(this);
            this.shadowRoot.addEventListener("click", this.#clickHandler);
        })
    }

    async #clicked(event) {
        event.target.setAttribute("aria-selected", !(event.target.getAttribute("aria-selected") === "true"));
    }
}

customElements.define("check-list", Checklist);