import "./../filter-header/filter-header.js";

class ContextMenu extends crsbinding.classes.BindableElement {
    #options;
    #point;
    #clickHandler;

    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

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

    async connectedCallback() {
        await super.connectedCallback();

        this.#clickHandler = this.click.bind(this);
        this.shadowRoot.addEventListener("click", this.#clickHandler);

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
        if (event.target.matches(".back")) {
            return await this.close();
        }


        /**
         * execute process api function if defined
         * this.dataset.value = selected id
         * this.dispatchEvent (selected id)
         */
    }

    async close() {
        await crs.call("context_menu", "close");
    }
}

customElements.define("context-menu", ContextMenu);