export class TabList extends HTMLElement {
    //TODO KR:
    // - Set keyboard interaction NOTE: will be handled by process API
    // - Overflow capabilities
    // - Status icon on tabs

    #clickHandler = this.#clicked.bind(this);
    #target;
    #selected;

    get clickedHandler() {
        return this.#clickHandler;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get selected() {
        return this.#selected;
    }

    set selected(newValue) {
        this.#selected = newValue;
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
        this.#selected = null;
    }

    async load() {
        await crsbinding.translations.parseElement(this);

        requestAnimationFrame(() => {
            this.shadowRoot.addEventListener("click", this.#clickHandler);
            this.#target = document.querySelector(`#${this.getAttribute("for")}`);
            this.#initAccessibility();
        })
    }

    #initAccessibility() {
        if (this.getAttribute("role") == null) this.setAttribute("role", "tablist");

        for (const child of this.children) {
            if (child.getAttribute("role") == null) child.setAttribute("role", "tab");

            const selected = child.getAttribute("aria-selected")
            if (selected == null) {
                child.setAttribute("aria-selected", "false");
                child.setAttribute("tab-index", "-1");
                continue;
            }

            if (selected === "true") {
                this.selected = child
                this.selected.setAttribute("tab-index", "0");
            }
        }
    }

    async #clicked(event) {
        this.#target.view = event.target.dataset.view;

        this.selected?.setAttribute("aria-selected", false);
        this.selected?.setAttribute("tab-index", "-1");
        this.selected = event.target;
        this.selected.setAttribute("aria-selected", true);
        this.selected.setAttribute("tab-index", "0");
    }
}

customElements.define("tab-list", TabList);