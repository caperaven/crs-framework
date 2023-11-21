export default class LayoutContainer extends HTMLElement {
    #columnState = {
        default: this.dataset.columns
    }

    async connectedCallback() {
        await this.#renderGrid();
    }

    async disconnectedCallback() {
        this.#columnState = null;
    }

    async #renderGrid() {
        const columns = this.dataset.columns;
        const rows = this.dataset.rows;

        if (columns == null && rows == null) return;

        await crs.call("cssgrid", "init", {
            element: this
        });

        await this.#drawGrid(columns, rows);
    }

    async #setColumnState(parameters) {
        const state = parameters?.state;
        const value = parameters?.value;

        if (value == null && state == null) return;

        let columns;
        (state === "default") ? columns = this.#columnState.default : columns = value;

        await this.#drawGrid(columns, this.dataset.rows);

        dispatchEvent(new CustomEvent("change", {detail: state}));
    }

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

    async onMessage(args) {
        if (args.message === "setColumnState") {
            await this.#setColumnState(args.parameters);
        }
    }
}
customElements.define("layout-container", LayoutContainer);