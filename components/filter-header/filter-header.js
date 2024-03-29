class FilterHeader extends crsbinding.classes.BindableElement {
    #container;

    get container() {
        return this.#container;
    }

    set container(newValue) {
        this.#container = newValue;
    }

    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async connectedCallback() {
        super.connectedCallback();
        const query = this.getAttribute("for");
        this.#container = this.parentElement.querySelector(query);
    }

    async disconnectedCallback() {
        this.#container = null;
        await super.disconnectedCallback();
    }

    async filter(event) {
        if (event.code == "ArrowDown") {
            return this.dispatchEvent(new CustomEvent("focus-out"));
        }

        await crs.call("dom_collection", "filter_children", {
            filter: event.target.value.toLowerCase(),
            element: this.#container
        })
    }

    async clear() {
        this.shadowRoot.querySelector("input").value = "";
    }

    async close() {
        this.dispatchEvent(new CustomEvent("close"));
    }
}

customElements.define("filter-header", FilterHeader);