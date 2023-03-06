import {CHANGE_TYPES} from "../../src/data-manager/data-manager-types.js";
import {ColumnsManager} from "./managers/columns-manager.js";
import {columnsFromChildren} from "./utils/columnsFromChildren.js";
import {columnsHeadersFactory} from "./factories/columns-headers-factory.js";
import {rowInflationFactory} from "./factories/row-inflation-factory.js";
import {rowFactory} from "./factories/row-factory.js";

/**
 * @class DataTable - a custom element that displays a data table
 *
 * Properties:
 * - dataManager {String} - name of the data manager to use
 * - dataManagerKey {String} - key to use for the data manager
 * - columns {Array} - array of column objects
 *
 * Events:
 * - ready - fired when the element is ready to be used from outside
 * - ondblclick - fired when a row is double-clicked passing on the id field value of the record
 *
 * Attributes:
 * - data-manager - name of the data manager to use, used instead of having to set the property
 * - data-manager-key - key to use for the data manager, used instead of having to set the property
 *
 * Methods:
 * - refresh - refresh the data, redrawing the grid
 * - filter - filter the data based on some criteria
 *
 * Property:
 * - selected - get the selected record/s
 *
 * @example <caption>html example</caption>
 * <data-table data-manager="my-data" data-manager-key="group1">
 *     <column data-heading="code" data-property="code" data-width="100"></column>
 *     <column data-heading="description" data-property="description" data-width="200"></column>
 * </data-table>
 *
 * @example <caption>javascript example to initialize the data table</caption>
 * await crs.call("data-table", "init", {
 *     element: document.querySelector("data-table"),
 *     dataManager: "my-data",
 *     dataManagerKey: "group1",
 *     columns: [
 *        { heading: "code", property: "code", width: 100 },
 *        { heading: "description", property: "description", width: 200 }
 *     ]
 * })
 *
 * @example <caption>javascript example to refresh table using process api</caption>
 * await crs.call("data-table", "set_columns", {
 *      element: document.querySelector("data-table"),
 *      columns: [
 *          { heading: "code", property: "code", width: 100 },
 *          { heading: "description", property: "description", width: 200 }
 *      ]
 * });
 *
 * @example <caption>javascript example to refresh table using process api</caption>
 * await crs.call("data-table", "refresh", { element: document.querySelector("data-table") });
 */
export class DataTable extends HTMLElement {
    #columnsManager = new ColumnsManager();
    #dataManager;
    #dataManagerKey;
    #dataManagerChangedHandler = this.#dataManagerChanged.bind(this);

    /**
     * @field #changeEventMap - lookup table for change events and what function to call on that event
     */
    #changeEventMap = {
        [CHANGE_TYPES.add]: this.#addRecord,
        [CHANGE_TYPES.update]: this.#updateRecord,
        [CHANGE_TYPES.delete]: this.#deleteRecord,
        [CHANGE_TYPES.filter]: this.#filterRecords,
        [CHANGE_TYPES.refresh]: this.refresh,
    };

    /**
     * @property dataManager - getter/setter for the dataManager property on what field to use as the id
     * @returns {*}
     */
    get #idField() {
        return dataManagers[this.#dataManager].idField;
    }

    /**
     * @constructor
     */
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    /**
     * @method connectedCallback - called when the element is added to the DOM
     * @returns {Promise<void>}
     */
    async connectedCallback() {
        columnsFromChildren(this.children, this.#columnsManager);

        this.shadowRoot.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(response => response.text());
        await this.load();
        await crs.call("component", "notify_ready", { element: this });
    }

    /**
     * @method load - load resources and attach event listeners
     * @returns {Promise<unknown>}
     */
    load() {
        return new Promise(resolve => {
            requestAnimationFrame(async () => {
                this.#dataManager = this.dataset["manager"];
                this.#dataManagerKey = this.dataset["manager-key"];

                await this.#hookDataManager();

                await crs.call("component", "notify_ready", { element: this });
                resolve();
            });
        })
    }

    /**
     * @method disconnectedCallback - called when the element is removed from the DOM
     * @returns {Promise<void>}
     */
    async disconnectedCallback() {
        this.#columnsManager = this.#columnsManager.dispose();

        await this.#unhookDataManager();
        this.#dataManagerChangedHandler = null;
        await crs.call("dom_interactive", "disable_resize", { element: this });
    }

    /**
     * @private
     * @method #hoodDataManager - get the data manager and set the event listeners to be notified of change
     */
    async #hookDataManager() {
        await crs.call("data_manager", "on_change", {
            manager: this.#dataManager,
            callback: this.#dataManagerChangedHandler
        });
    }

    /**
     * @private
     * @method #unhookDataManager - remove the event listeners from the data manager
     */
    async #unhookDataManager() {
        await crs.call("data_manager", "remove_change", {
            manager: this.#dataManager,
            callback: this.#dataManagerChangedHandler
        });
    }

    /**
     * @private
     * @method dataManagerChanged - called when the data manager has changed
     * Update the table based on the change action (add, update, delete, refresh)
     * @param args {Object} - arguments from the data manager change event
     */
    async #dataManagerChanged(args) {
        await this.#changeEventMap[args.action].call(this, args);
    }

    /**
     * @method #addRecord - add a record to the table where it was added in the data manager
     * @param args {Object} - arguments from the data manager change event
     * @returns {Promise<void>}
     */
    async #addRecord(args) {
    }

    /**
     * @method #updateRecord - update a record in the table where it was updated in the data manager
     * @param args {Object} - arguments from the data manager change event
     * @returns {Promise<void>}
     */
    async #updateRecord(args) {
    }

    /**
     * @method #deleteRecord - delete a record from the table where it was deleted in the data manager
     * @param args {Object} - arguments from the data manager change event
     * @returns {Promise<void>}
     */
    async #deleteRecord(args) {
    }

    /**
     * @method #filterRecords - the data manager performed a filter operation and these are the records you need to show
     * @param args {Object} - arguments from the data manager change event
     * @returns {Promise<void>}
     */
    async #filterRecords(args) {
    }

    /**
     * @method #buildTable - build the table from scratch by building the columns and rows in the HTML Table element
     * @param data {Array} - data to build the rows from
     * @returns {Promise<void>}
     */
    async #buildTable(data) {
        await this.#buildColumns();
        await this.#buildRows(data);
    }

    /**
     * @method #buildColumns - build the columns and headers in the HTML Table element
     * @returns {Promise<void>}
     */
    async #buildColumns() {
        this.style.setProperty("--columns", this.#columnsManager.gridTemplateColumns);

        const headers = await columnsHeadersFactory(this.#columnsManager.columns);
        this.shadowRoot.appendChild(headers);
    }

    /**
     * @method #buildRows - build the rows in the HTML Table element
     * @param data {Array} - data to build the rows from
     * @returns {Promise<void>}
     */
    async #buildRows(data) {
        const fragment = document.createDocumentFragment();
        const createRowFn = rowFactory(this.#columnsManager.columns);

        for (const record of data) {
            await createRowFn(record, fragment);
        }

        this.shadowRoot.appendChild(fragment);
    }

    /**
     * @method refresh - refresh the data
     * @param data {Array} - data to refresh the table with
     * if the data is null then the data manager will be used to get the all the data
     * but if you define the data in this parameter then the data manager will be ignored and you render what is given.
     * @returns {Promise<void>}
     */
    async refresh(data = null) {
        this.innerHTML = "";

        data ||= await crs.call("data_manager", "get_all", { manager: this.#dataManager });
        await this.#buildTable(data);
    }

}

customElements.define("data-table", DataTable);