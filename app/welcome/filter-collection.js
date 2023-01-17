class FilterCollection extends HTMLUListElement {
    static get observedAttributes() { return ["data-filter"]; }

    async connectedCallback() {
        await crs.call("component", "notify_ready", {element: this});
    }

    async #filter(text) {
        await crs.call("dom_collection", "filter_children", {
            filter: text,
            element: this
        })
    }

    async attributeChangedCallback(name, oldValue, newValue) {
        if (name === "data-filter") {
            await this.#filter(newValue);
        }
    }
}

customElements.define("filter-collection", FilterCollection, {extends: "ul"});