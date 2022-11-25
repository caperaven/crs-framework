export class TabList extends HTMLElement {
    //TODO KR:
    // - Set keyboard interaction NOTE: will be handled by process API
    // - Overflow capabilities
    // - Status icon on tabs

    #clickHandler = this.#clicked.bind(this);
    #target;

    //This is for testing purposes
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
        await this.shadowRoot.removeEventListener("click", this.#clickHandler);
        this.#clickHandler = null;
        this.#target = null;
    }

    async load() {
        requestAnimationFrame( async () => {
            this.shadowRoot.addEventListener("click", this.#clickHandler);
            this.#target = document.querySelector(this.getAttribute("for"));
            await crsbinding.translations.parseElement(this);
        })
    }

    async #clicked(event) {
        this.#target.view = event.target.dataset.view;
        await crs.call("dom_collection", "toggle_selection", {target: event.target});
    }
}

customElements.define("tab-list", TabList);