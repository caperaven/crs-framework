class FilterHeader extends crs.classes.BindableElement {
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
        if (event.code == "ArrowDown") {
            return this.dispatchEvent(new CustomEvent("focus-out", { bubbles: true, composed: true }));
        }

        const target = event.composedPath()[0];

        await crs.call("dom_collection", "filter_children", {
            filter: target.value.toLowerCase(),
            element: this.#container
        })
    }

    async close() {
        this.dispatchEvent(new CustomEvent("close", { bubbles: true, composed: true }));
    }
}

customElements.define("filter-header", FilterHeader);