export default class KanBan extends crsbinding.classes.BindableElement {
    #columns;

    get columns() {
        return this.#columns;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async connectedCallback() {
        super.connectedCallback();

        this.#columns = [];
    }

    /**
     * Create the required elements in the header and container for the new columns
     * @param columns
     * @returns {Promise<void>}
     */
    async addColumnElements(columns) {
        dispatchEvent(new CustomEvent("columns-added", {detail: this}));
    }
}

customElements.define("kan-ban", KanBan);