import "./../filter-header/filter-header.js";

class ContextMenu extends HTMLElement {
    #options;
    #point;
    #clickHandler;

    get options() {
        return this.#options;
    }

    set options(newValue) {
        this.#options = newValue;
    }

    get point() {
        return this.#point;
    }

    set point(newValue) {
        this.#point = newValue;
    }

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());
        this.#clickHandler = this.click.bind(this);
        this.addEventListener("click", this.#clickHandler);

        requestAnimationFrame(async () => {
            const ul = this.shadowRoot.querySelector(".popup");

            await crs.call("fixed_layout", "set", {
                element: ul,
                point: this.#point,
                at: "right",
                anchor: "top",
            })
        })
    }

    async disconnectedCallback() {
        this.removeEventListener("click", this.#clickHandler);
        this.#clickHandler = null;
        this.#options = null;
    }

    async click(event) {
        /**
         * execute process api function if defined
         * this.dataset.value = selected id
         * this.dispatchEvent (selected id)
         */
        await crs.call("context_menu", "close");
    }
}

customElements.define("context-menu", ContextMenu);