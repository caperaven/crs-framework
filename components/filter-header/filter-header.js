class FilterHeader extends crsbinding.classes.BindableElement {
    #container;

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
        await crs.call("dom_collection", "filter_children", {
            filter: event.target.value,
            element: this.#container
        })
    }

    async close() {
        this.dispatchEvent(new CustomEvent("close"));
    }
}

customElements.define("filter-header", FilterHeader);