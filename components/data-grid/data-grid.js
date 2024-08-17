import {DATA_GRID_CELLS_QUERY} from "./grid-cells/grid-cells.js";
import {assertClassType} from "../../src/utils/assertClassType.js";
import {UpdateOptions} from "./core/update-options.js";


export default class DataGrid extends crs.classes.BindableElement {
    #columns;
    #dataManager;

    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get columns() {
        return Object.freeze(this.#columns);
    }

    set columns(newValue) {
        this.#columns = assertClassType(newValue, "Columns");
        this.#notifyColumnsChanged(UpdateOptions.COLUMNS);
    }

    get dataManager() {
        return this.#dataManager;
    }

    set dataManager(newValue) {
        this.#dataManager = assertClassType(newValue, "string");
    }

    async connectedCallback() {
        await super.connectedCallback();
        this.#notifyColumnsChanged(UpdateOptions.COLUMNS);
    }

    /**
     * update child components of changes happening using the messaging system.
     * @param updateOptions - bitwise flag to indicate what has changed.
     */
    #notifyColumnsChanged(updateOptions) {
        if (this.dataset.ready !== "true") return;

        if (updateOptions | UpdateOptions.COLUMNS) {
            sendMessage.call(this, DATA_GRID_CELLS_QUERY, {columns: this.columns});
        }
    }
}

function sendMessage(query, args) {
    const element = this.shadowRoot.querySelector(query);

    crs.call("component", "on_ready", {element: element, callback: () => {
            element?.onMessage(args);
    }, caller: this});
}

customElements.define("data-grid", DataGrid);