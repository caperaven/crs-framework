import "./../../components/tab-list/tab-list.js";
import {ItemsFactory} from "./items-factory.js";

/**
 * @class AvailableSelected - This is a component that allows you to select items from a list of available items.
 *
 * @example <caption>html simple example</caption>
 * <available-selected data-id-field="title"></available-selected>
 *
 * @example <caption>allow reordering of selected items</caption>
 * <available-selected data-id-field="title" data-orderable="true"></available-selected>
 *
 * To allow you to reorder the selected items you need to set the data-orderable attribute to true.
 *
 * @example <caption>allow drill down of available items</caption>
 * <available-selected data-id-field="title" data-drilldownable="true"></available-selected>
 *
 * To allow you to drill down the available items you need to set the data-drilldownable attribute to true.
 *
 * @todo - JHR: this is not complete @Kieran please finish this
 * - add drill down functionality
 * - add drag and drop ordering functionality (process api required feature)
 * - fix data-attributes to match above
 * - tests are missing :( @Kieran please add tests
 * - the items factory really should be a HTML Template instead of building it up manually
 */
export class AvailableSelected extends HTMLElement {
    #clickHandler = this.#click.bind(this);
    #tablist;
    #perspectiveElement;
    #data;
    #currentView;

    //This is for testing purposes
    get clickedHandler() {
        return this.#clickHandler;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    constructor() {
        super();
        this.attachShadow({mode:"open"});
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch(this.html).then(result => result.text());
        await this.load();
    }

    async load() {
        requestAnimationFrame( async () => {
            this.shadowRoot.addEventListener("click", this.#clickHandler);
            this.#tablist = this.shadowRoot.querySelector("tab-list");
            this.#currentView = "selected";
            await crsbinding.translations.parseElement(this);
            await crs.call("component", "notify_ready", {element: this});
        })
    }

    async disconnectedCallback() {
        await this.shadowRoot.removeEventListener("click", this.#clickHandler);
        this.#clickHandler = null;
        this.#data = null
        this.#currentView = null;
        this.#tablist = null;
        this.#perspectiveElement = this.#perspectiveElement?.dispose();
    }

    async #click(event) {
        const target = event.target;
        if (target.dataset.action != null) {
            this[target.dataset.action] != null && await this[target.dataset.action](event);
        }
    }

    /**
     * @method toggle - This method will toggle the selected item from the available list to the selected list.
     * @param event {Event} - The click event.
     * @returns {Promise<void>}
     */
    async toggle(event) {
        const li = event.target.parentElement;

        const source = li.getAttribute("class");
        if (source !== this.#currentView) this.#currentView = source;

        const target = source === "available" ? "selected" : "available";
        const value = this.#data[source].find(item => `${item[this.dataset.idField || "id"]}` === `${li.dataset.id}`);

        await crs.call("array", "transfer", {source: this.#data[source], target: this.#data[target], value: value});
        await this.update(this.#data);
    }

    /**
     * @method update - This method will update the data for the component.
     * @param data {Object} - The data to update the component with.
     * @returns {Promise<void>}
     */
    async update(data) {
        this.#data = data;
        const selectedTemplate = await ItemsFactory.createTemplate(this, this.#currentView, "selected", this.#data);
        const availableTemplate = await ItemsFactory.createTemplate(this, this.#currentView, "available", this.#data);

        const perspectiveElement = document.createElement("perspective-element");
        perspectiveElement.appendChild(selectedTemplate);
        perspectiveElement.appendChild(availableTemplate);
        perspectiveElement.dataset.store = perspectiveElement._dataId;

        if (this.#perspectiveElement != null) {
            this.shadowRoot.removeChild(this.#perspectiveElement);
            this.#perspectiveElement = await this.#perspectiveElement?.dispose();
        }

        this.shadowRoot.appendChild(perspectiveElement);
        this.#perspectiveElement = perspectiveElement;
        this.#tablist.target = this.#perspectiveElement;
    }

    /**
     * @method getSelectedItems - This method will return the selected items.
     * @returns {*}
     */
    getSelectedItems() {
        return this.#data.selected;
    }
}

customElements.define("available-selected", AvailableSelected);