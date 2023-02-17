import {CHANGE_TYPES} from "../../src/data-manager/data-manager-types.js";

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
 *
 * Attributes:
 * - data-manager - name of the data manager to use, used instead of having to set the property
 *
 * Methods:
 * - refresh - refresh the data, redrawing the grid
 * - filter - filter the data based on some criteria
 *
 * @example <caption>html example</caption>
 * <data-table data-manager="my-data" data-manager-key="group1">
 *     <column heading="code" property="code"></column>
 *     <column heading="description" property="description"></column>
 * </data-table>
 *
 * @example <caption>javascript example to initialize the data table</caption>
 * await crs.call("data-table", "init", {
 *     element: document.querySelector("data-table"),
 *     dataManager: "my-data",
 *     dataManagerKey: "group1",
 *     columns: [
 *        { heading: "code", property: "code" },
 *        { heading: "description", property: "description" }
 *     ]
 * })
 *
 * @example <caption>javascript example to refresh table using process api</caption>
 * await crs.call("data-table", "set_columns", {
 *      element: document.querySelector("data-table"),
 *      columns: [
 *          { heading: "code", property: "code" },
 *          { heading: "description", property: "description" }
 *      ]
 * });
 *
 * @example <caption>javascript example to refresh table using process api</caption>
 * await crs.call("data-table", "refresh", { element: document.querySelector("data-table") });
 */
export class DataTable extends HTMLElement {
    #columns;

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

    get columns() {
        return this.#columns;
    }

    set columns(value) {
        this.#columns = value;
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
                // load resources
                this.#loadColumnsFromChildren();
                this.#hookDataManager();
                resolve();
            });
        })
    }

    /**
     * @method disconnectedCallback - called when the element is removed from the DOM
     * @returns {Promise<void>}
     */
    async disconnectedCallback() {
        // dispose of resources
        this.#unhookDataManager();
    }

    /**
     * @private
     * @method #hoodDataManager - get the data manager and set the event listeners to be notified of change
     */
    #hookDataManager() {
        // when registering with the data manager, I need a key to be used in the filter operation
        // this key is used to only update visualizations that use the same key.
    }

    /**
     * @private
     * @method #unhookDataManager - remove the event listeners from the data manager
     */
    #unhookDataManager() {

    }

    /**
     * @private
     * @method dataManagerChanged - called when the data manager has changed
     * Update the table based on the change action (add, update, delete, refresh)
     * @param args {Object} - arguments from the data manager change event
     */
    async #dataManagerChanged(args) {
        await this.#changeEventMap[args.action](args);
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
        const data = args.models; // this is the data that came back after doing the filter.
        await this.refresh(data);
    }

    /**
     * @private
     * @method #loadColumnsFromChildren - Look at the component's children and load the columns from them
     * <column heading="code" property="code"></column>
     *
     * If there are no children just ignore it.
     */
    #loadColumnsFromChildren() {

    }

    /**
     * @method #buildTable - build the table from scratch by building the columns and rows in the HTML Table element
     * @returns {Promise<void>}
     */
    async #buildTable() {
        await this.#buildColumns();
        await this.#buildRows();
    }

    /**
     * @method #buildColumns - build the columns and headers in the HTML Table element
     * @returns {Promise<void>}
     */
    async #buildColumns() {

    }

    /**
     * @method #buildRows - build the rows in the HTML Table element
     * @returns {Promise<void>}
     */
    async #buildRows() {

    }

    /**
     * @method filter - filter the data based on some criteria
     * @param criteria {Object} - criteria to filter the data
     * @returns {Promise<void>}
     */
    async filter(criteria) {
        // on data manager make is so that perspective actions can affect the data manager or
        // crs.call("data_manager", "filter", { data_manager: this.dataManager, criteria: criteria });
        // the data manager will cause a refresh to be called and
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

        data ||= await crs.call("data_manager", "get_all", { data_manager: this.dataManager });
        await this.#buildTable(data);
    }

}

customElements.define("data-table", DataTable);