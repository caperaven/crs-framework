import "./actions/editing-actions.js";
import {addColumnFeatures} from "./columns.js";
import {addSelectionFeature} from "./selection.js";
import {selectedConverter} from "./value-converters/selected-converter.js";
import {enableInput, disableInput} from "./input.js";

export default class DataGrid extends crsbinding.classes.BindableElement {
    #columns;
    #columnGroups;

    get shadowDom() {
        return true;
    }

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

        // add dispose and event stuff
        // await crs.call("data_manager", "on_change", {
        //     manager: this.dataset.manager,
        //     callback: this.recordChangedHandler
        // })
    }

    async disconnectedCallback() {
        crsbinding.valueConvertersManager.remove("selected");

        this.#columns = null;
        this.#columnGroups = null;

        await disableInput(this);
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
        this.dispatchEvent(new CustomEvent("row-execute", event.target));
    }

    async addColumnElements(columns) {
        dispatchEvent(new CustomEvent("columns-added", {detail: this}));
    }

    async modifyRecord(rowIndex, field, value, convert) {
        if (convert != null) {
            value = await crsbinding.valueConvertersManager.convert(value, convert.converter, "set", convert.parameter);
        }

        // await crs.call("data_manager", "update", {
        //     manager: this.dataset.manager,
        //     index: rowIndex,
        //     changes: {
        //         [field]: value
        //     }
        // })
    }
}

customElements.define("data-grid", DataGrid);