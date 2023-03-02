import {CHANGE_TYPES} from "../../src/data-manager/data-manager-types.js";

/**
 * @class PageToolbar - a custom element that displays a data table
 * This component manages the data for visualizations like the data table.
 * It uses the data manager to manage the data part.
 * We need to at least know how many records we have and how big the page size is.
 * From that we can manage the navigation through the pages
 *
 * Properties:
 * - dataManager {String} - name of the data manager to use
 * - pageSize {Number} - number of rows to display per page
 *
 * Events:
 * - ready - fired when the element is ready to be used from outside
 * - change - fired when the value changes
 *
 * Attributes:
 * - data-something - some attribute
 *
 * Methods:
 * - refresh - refresh the component from the data
 *
 * Translations Required:
 * - pageToolbar.rowsPerPage
 *
 * @example <caption>html example</caption>
 * <page-toolbar data-manager="my_manager" for="data-table" data-page-size="10"></page-toolbar>
 */
export class PageToolbar extends HTMLElement {
    #recordCount = 0;
    #lastPage;
    #dataManager;
    #dataManagerKey;
    #dataManagerChangedHandler = this.#dataManagerChanged.bind(this);
    #clickHandler = this.#click.bind(this);
    #changeHandler = this.#change.bind(this);
    #edtPageSize;
    #edtPageNumber;

    /**
     * @property pageSize - the number of rows to display per page
     * You can get and set this property.
     * It is made public so that it has access via the process api.
     * Internal logic for managing page size will still be enforced.
     * @returns {*}
     */
    get pageSize() {
        return Number(this.#edtPageSize.value);
    }

    set pageSize(newValue) {
        newValue = Number(newValue);

        if (newValue < 1) {
            newValue = 1;
        }

        this.#edtPageSize.value = Number(newValue);
    }

    get pageNumber() {
        return Number(this.#edtPageNumber.value);
    }

    set pageNumber(newValue) {
        newValue = Number(newValue);

        if (newValue < 1) {
            newValue = 1;
        }

        if (newValue > this.#lastPage) {
            newValue = this.#lastPage;
        }

        this.#edtPageNumber.value = newValue;
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
                this.setAttribute("role", "toolbar");

                this.#edtPageSize = this.shadowRoot.querySelector("#edtPageSize");
                this.#edtPageNumber = this.shadowRoot.querySelector("#edtPageNumber");

                const size = this.dataset["page-size"];
                this.pageSize = size ? parseInt(size) : 10;

                this.#dataManager = this.dataset["manager"];

                await this.#translate();
                this.#dataManager = this.dataset["manager"];
                this.#dataManagerKey = this.dataset["manager-key"];
                await this.#hookDataManager();

                this.shadowRoot.addEventListener("click", this.#clickHandler);
                this.shadowRoot.addEventListener("change", this.#changeHandler);
                resolve();
            });
        })
    }

    /**
     * @method disconnectedCallback - called when the element is removed from the DOM
     * @returns {Promise<void>}
     */
    async disconnectedCallback() {
        this.shadowRoot.removeEventListener("click", this.#clickHandler);
        this.shadowRoot.removeEventListener("change", this.#changeHandler);

        await this.#unhookDataManager();

        this.#dataManagerChangedHandler = null;
        this.#clickHandler = null;
        this.#changeHandler = null;
        this.#edtPageSize = null;
        this.#edtPageNumber = null;
    }

    async #translate() {
        const element = this.shadowRoot.querySelector("#divLabel");
        await crsbinding.translations.parseElement(element);
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

        this.#recordCount = await crs.call("data_manager", "record_count", { manager: this.#dataManager });

        if (this.#recordCount < this.pageSize) {
            this.pageSize = this.#recordCount;
        }

        this.#calculateLastPage();
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

    async #dataManagerChanged(args) {
        if (args.action == CHANGE_TYPES.refresh) {
            this.#recordCount = args.count;
            this.#calculateLastPage();
        }
    }

    async #click(event) {
        if (event == null) return;

        const target = event.composedPath()[0];

        const fn = {
            "gotoFirstPage": this.#gotoFirstPage,
            "gotoPreviousPage": this.#gotoPreviousPage,
            "gotoNextPage": this.#gotoNextPage,
            "gotoLastPage": this.#gotoLastPage
        }[target.id];

        fn?.call(this);
    }

    async #change(event) {
        if (event == null) return;

        const target = event.composedPath()[0];

        const fn = {
            "pageSize": this.#pageSizeChanged,
            "edtPageNumber": this.#pageNumberChanged
        }[target.dataset.property];

        fn?.call(this, target.value);
    }

    #pageSizeChanged(value) {
        if (value > 100) {
            return this.pageSize = 100;
        }

        if (value < 1) {
            return this.pageSize = 1;
        }

        if (value > this.#recordCount) {
            return this.pageSize = this.#recordCount;
        }

        this.pageSize = value;
    }

    #pageNumberChanged(value) {
        this.pageNumber = value;
        this.#notifyRefresh();
    }

    /**
     * @method #gotoFirstPage - go to the first page of the data and notify the target component
     */
    #gotoFirstPage() {
        this.pageNumber = 1;
        this.#notifyRefresh();
    }

    /**
     * @method #gotoPreviousPage - go to the previous page of the data and notify the target component
     */
    #gotoPreviousPage() {
        this.pageNumber -= 1;
        this.#notifyRefresh();
    }

    /**
     * @method #gotoNextPage - go to the next page of the data and notify the target component
     */
    #gotoNextPage() {
        this.pageNumber += 1;
        this.#notifyRefresh();
    }

    /**
     * @method #gotoLastPage - go to the last page of the data and notify the target component
     */
    #gotoLastPage() {
        this.pageNumber = this.#lastPage;
        this.#notifyRefresh();
    }

    /**
     * @method notifyRefresh - notify the component that the data has been refreshed
     * use the for attribute to get the query of what component to target.
     * the use that element's refresh method to refresh the data
     */
    #notifyRefresh() {
        const target = document.querySelector(this.getAttribute("for"));

        const data = []; // use the data manager to get the data
        target?.refresh(data);
    }

    #calculateLastPage() {
        this.#lastPage = Math.ceil(this.#recordCount / this.pageSize);

        if (this.#lastPage < 1) {
            this.#lastPage = 1;
        }
    }
}

customElements.define("page-toolbar", PageToolbar);