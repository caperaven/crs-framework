export default class LayoutContainer extends HTMLElement {

    async connectedCallback() {
        await this.#renderGrid();
    }

    /**
     * @method #renderGrid - renders the grid based on the data-columns and data-rows attributes
     * @return {Promise<void>}
     */
    async #renderGrid() {
        const columns = this.dataset.columns;
        const rows = this.dataset.rows;

        if (columns == null && rows == null) return;

        await crs.call("cssgrid", "init", {
            element: this
        });

        await this.#drawGrid(columns, rows);
    }

    /**
     * @method #setColumnState - sets the column state based on the state and value passed in
     * @param parameters {Object} - {state: "default" || "custom", value: "0 2fr 1fr"}  is the value of the columns
     * @return {Promise<void>}
     */
    async #setColumnState(parameters) {
        const state = parameters?.state;
        const value = parameters?.value || this.dataset.columns;

        if (value == null && state == null) return;

        await this.#drawGrid(value, this.dataset.rows);

        this.dispatchEvent(new CustomEvent("change", {detail: state}));
    }

    /**
     * @method #drawGrid - draws the grid based on the columns and rows passed in
     * @param columns {String} - it is the value of the columns
     * @param rows {String} - it is the value of the rows
     * @return {Promise<void>}
     */
    async #drawGrid(columns, rows) {
        if (columns == null && rows == null) return;

        await crs.call("cssgrid", "set_columns", {
            element: this,
            columns: columns
        });

        await crs.call("cssgrid", "set_rows", {
            element: this,
            rows: rows
        });
    }

    /**
     * @method onMessage - listens for the setColumnState message and calls the #setColumnState method
     * @param args {Object} - it is the object that is passed in from the postMessage
     * @return {Promise<void>}
     */
    async onMessage(args) {
        if (args.message === "setColumnState" || args.key === "setColumnState") {
            await this.#setColumnState(args.parameters);
        }
    }
}
customElements.define("layout-container", LayoutContainer);