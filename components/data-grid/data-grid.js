import "./actions/editing-actions.js";

export default class DataGrid extends crsbinding.classes.BindableElement {
    #columns;
    #columnGroups;

    get columns() {
        return this.#columns;
    }

    get columnGroups() {
        return this.#columnGroups;
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

    /**
     * Used during double click or keyboard events to execute primary row actions
     * @param event
     * @returns {Promise<void>}
     */
    async rowExecute(event) {
        /**
         * execute = open record in dialog - working on row
         * ctrl + execute = open cell item in dialog - working on cell
         */


        // JHR: make this to work with ctrl + click instead
        if (event.ctrlKey == true) {
            return await crs.call("grid_editing", "edit", { element: event.target });
        }

        event.preventDefault();
        // this.dispatchEvent(new CustomEvent("row-execute", event.target));

        event.target.parentElement.style.translate = "0 600px";

    }
}

customElements.define("data-grid", DataGrid);