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
 * @example <caption>html example</caption>
 * <page-toolbar data-manager="my_manager"></page-toolbar>
 */
export class PageToolbar extends HTMLElement {
    #dataManager;
    #dataManagerKey;
    #dataManagerChangedHandler = this.#dataManagerChanged.bind(this);
    #clickHandler = this.#click.bind(this);

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
                this.#dataManager = this.dataset["manager"];
                this.#dataManagerKey = this.dataset["manager-key"];
                await this.#hookDataManager();
                resolve();
            });
        })
    }

    /**
     * @method disconnectedCallback - called when the element is removed from the DOM
     * @returns {Promise<void>}
     */
    async disconnectedCallback() {
        await this.#unhookDataManager();
        this.#dataManagerChangedHandler = null;
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

    async #dataManagerChanged() {

    }

    async #click(event) {

    }
}

customElements.define("page-toolbar", PageToolbar);