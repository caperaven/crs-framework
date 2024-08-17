import {DATA_GRID_CELLS_QUERY} from "./grid-cells/grid-cells.js";
import {DATA_GRID_HEADER_QUERY} from "./grid-header/grid-header.js";
import {assertClassType} from "../../src/utils/assertClassType.js";
import {assertExists} from "../../src/utils/assertExists.js";
import {UpdateOptions} from "./core/update-options.js";
import {Columns} from "./columns/columns.js";

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
        this.#notifyColumnsChanged(UpdateOptions.COLUMNS).catch(error => console.error(error));
    }

    get dataManager() {
        return this.#dataManager;
    }

    set dataManager(newValue) {
        this.#dataManager = assertClassType(newValue, "string");
    }

    async connectedCallback() {
        await super.connectedCallback();
        await this.#notifyColumnsChanged(UpdateOptions.COLUMNS, DATA_GRID_HEADER_QUERY, DATA_GRID_CELLS_QUERY);
    }

    /**
     * update child components of changes happening using the messaging system.
     * @param updateOptions - bitwise flag to indicate what has changed.
     * @param targetQuery - query selector to find the element to send the message to.
     */
    async #notifyColumnsChanged(updateOptions, ...targetQuery) {
        if (this.dataset.ready !== "true") return;

        if (updateOptions | UpdateOptions.COLUMNS) {
            for (const query of targetQuery) {
                await sendMessage.call(this, query, {columns: this.columns});
            }
        }
    }
}

/**
 * Wait for the element to be ready and then send a message to it.
 * @param query {string} - query selector to find the element
 * @param args {object} - arguments to send to the element
 */
async function sendMessage(query, args) {
    const element = this.shadowRoot.querySelector(query);
    assertExists(element, `Element with query "${query}" not found`);

    await crs.call("component", "on_ready", {element: element, callback: async () => {
        await element.onMessage(args);
    }, caller: this});
}

customElements.define("data-grid", DataGrid);