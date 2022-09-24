import "./columns-manager.js"

export default class DataGrid extends crsbinding.classes.BindableElement {
    #columns;
    #columnGroups;

    get columns() {
        return this.#columns;
    }

    set columns(newValue) {
        this.#columns = newValue;
    }

    get columnGroups() {
        return this.#columnGroups;
    }

    set columnGroups(newValue) {
        this.#columnGroups = newValue;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async connectedCallback() {
        await super.connectedCallback();
        this.#columns = [];
        this.#columnGroups = [];
    }

    async disconnectedCallback() {
        this.#columns = null;
        this.#columnGroups = null;
        await super.disconnectedCallback();
    }
}

customElements.define("data-grid", DataGrid);