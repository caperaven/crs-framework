import {CHANGE_TYPES} from "../../src/data-manager/data-manager-types.js";
import {ColumnsManager} from "./managers/columns-manager.js";
import {columnsFromChildren} from "./utils/columnsFromChildren.js";
import {columnsHeadersFactory} from "./factories/columns-headers-factory.js";
import {rowInflationFactory} from "./factories/row-inflation-factory.js";
import {rowFactory} from "./factories/row-factory.js";
import {MouseInputManager} from "./managers/mouse-input-manager.js";
import {KeyboardInputManager} from "./managers/keyboard-input-manager.js";
import {DataTableExtensions} from "./data-table-extensions.js";
import {formattingFromChildren} from "./utils/formattingFromChildren.js";

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
    #inflationFn;
    #keyboardInputManager;
    #mouseInputManager;
    #extensions = {
        [DataTableExtensions.FORMATTING.name]: DataTableExtensions.FORMATTING.path,
        [DataTableExtensions.CELL_EDITING.name]: DataTableExtensions.CELL_EDITING.path,
    };

    #selectedRows;
    #selectedCells;

    get selectedRows() {
        return this.#selectedRows;
    }

    get selectedCells() {
        return this.#selectedCells;
    }

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
        await columnsFromChildren(this, this.#columnsManager);
        await formattingFromChildren(this);

        this.innerHTML = "";
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

                this.#keyboardInputManager = new KeyboardInputManager(this);
                this.#mouseInputManager = new MouseInputManager(this);

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
        this.#inflationFn = null;
        this.#keyboardInputManager = this.#keyboardInputManager.dispose();
        this.#mouseInputManager = this.#mouseInputManager.dispose();

        this.disposeExtension(DataTableExtensions.FORMATTING.name);
        this.disposeExtension(DataTableExtensions.CELL_EDITING.name);

        this.#extensions = null;
    }

    disposeExtension(name) {
        this.#extensions[name] = this.#extensions[name].dispose?.();
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
        this.#inflationFn = await rowInflationFactory(this, this.#columnsManager.columns, this.#idField);

        const fragment = document.createDocumentFragment();
        const createRowFn = rowFactory(this.#columnsManager.columns, this.#idField);

        for (const record of data) {
            const row = await createRowFn(record, fragment);
            this.#inflationFn(record, row);
        }

        this.shadowRoot.appendChild(fragment);
    }

    /**
     * @method #updateRows - update the rows in the HTML Table element
     * @param data
     * @returns {Promise<void>}
     */
    async #updateRows(data) {
        const rowElements = Array.from(this.shadowRoot.querySelectorAll("[data-id]"));
        const diff = data.length - rowElements.length;

        // add elements for each new record
        if (diff > 0) {
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < diff; i++) {
                const rowElement = rowElements[0].cloneNode(true);
                rowElements.push(rowElement);
                fragment.appendChild(rowElement);
            }
            this.shadowRoot.appendChild(fragment);
        }

        // remove elements that are not going to be used
        if (diff < 0) {
            for (let i = 0; i < Math.abs(diff); i++) {
                const rowElement = rowElements.pop();
                rowElement.remove();
            }
        }

        // inflate the elements
        for (let i = 0; i < data.length; i++) {
            const record = data[i];
            const rowElement = rowElements[i];
            await this.#inflationFn(record, rowElement);
        }
    }

    /**
     * @method refresh - refresh the data
     * @param data {Array} - data to refresh the table with
     * if the data is null then the data manager will be used to get the all the data
     * but if you define the data in this parameter then the data manager will be ignored and you render what is given.
     * @returns {Promise<void>}
     */
    async refresh(data = null) {
        data ||= await crs.call("data_manager", "get_all", { manager: this.#dataManager });

        if (this.#inflationFn == null) {
            await this.#buildTable(data);
        }
        else {
            await this.#updateRows(data);
        }
    }

    /**
     * @method setExtension - you can enable or disable an extension here.
     * you can also just update the properties on a already loaded extension.
     * @param extName {String} - the name of the extension
     * @param settings {*} - the settings for the extension
     * @param enabled {Boolean} - if the extension is enabled or not
     * @returns {Promise<*>}
     */
    async setExtension(extName, settings, enabled) {
        const ext = this.#extensions[extName];
        const extType = typeof ext;

        // if this a string it is not loaded.
        // if it is not loaded, and we enable it then load it.
        // if it is not loaded, and we disable it, then do nothing.
        if (extType === "string" && enabled === true) {
            this.#extensions[extName] = new (await import(ext)).default(this, settings);
            return;
        }

        // if this has been loaded, and we disable it then dispose of it.
        if (extType === "object" && enabled === false) {
            return this.disposeExtension(extName);
        }

        // this has been loaded, so we just want to update the settings
        this.#extensions[extName].settings = settings;
    }

    /**
     * @method callExtension - call a method on an extension
     * This is used by any code that wants to execute a method on an extension if that extension has been loaded.
     * If the extension is not loaded, the method will not be called
     * @param extName {String} - the name of the extension
     * @param method {String} - the name of the async method to call.
     * @param args {*} - the arguments to pass to the method
     * @returns {Promise<*>}
     */
    async callExtension(extName, method, args) {
        if (typeof this.#extensions[extName] !== "string") {
            return await this.#extensions[extName][method](args);
        }
    }

    /**
     * @method getColumnIndex - get the index of a column by its name
     * @param columnName {String} - the name of the column
     */
    getColumnIndex(columnName) {
        return this.#columnsManager.getColumnIndex(columnName);
    }
}

customElements.define("data-table", DataTable);