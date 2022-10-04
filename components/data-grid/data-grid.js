import "./actions/editing-actions.js";
import {addColumnFeatures} from "./columns.js";
import {addSelectionFeature} from "./selection.js";
import {selectedConverter} from "./value-converters/selected-converter.js";
import {enableInput, disableInput} from "./input.js";

export default class DataGrid extends crsbinding.classes.BindableElement {
    #columns;
    #columnGroups;

    get columns() {
        return this.#columns;
    }

    get columnGroups() {
        return this.#columnGroups;
    }

    get selectionType() {
        return this.dataset.selection || "none";
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async connectedCallback() {
        await super.connectedCallback();

        crsbinding.valueConvertersManager.add("selected", selectedConverter);

        this.#columns = [];
        this.#columnGroups = [];

        await addColumnFeatures(this);
        await addSelectionFeature(this);
        await enableInput(this);
    }

    async disconnectedCallback() {
        crsbinding.valueConvertersManager.remove("selected");

        this.#columns = null;
        this.#columnGroups = null;

        await disableInput(this);
        await disableSelectionFeature(this);
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

    async addColumnElements(columns) {
        dispatchEvent(new CustomEvent("columns-added", {detail: this}));
    }
}

customElements.define("data-grid", DataGrid);