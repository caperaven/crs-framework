import "./../../components/tab-list/tab-list.js";
import {ItemsFactory} from "./items-factory.js";

const TabViews= Object.freeze({
    AVAILABLE: "available",
    SELECTED: "selected"
});

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
 */
export class AvailableSelected extends HTMLElement {
    #clickHandler = this.#click.bind(this);
    #changeHandler = this.#changeTabView.bind(this);
    #tablist;
    #data;
    #currentView;
    #availableList;
    #selectedList;

    //This is for testing purposes
    get clickedHandler() {
        return this.#clickHandler;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch(this.html).then(result => result.text());
        this.innerHTML = await fetch(import.meta.url.replace(".js", ".lightdom.html")).then(res => res.text());
        await this.load();
    }

    load() {
        return new Promise((resolve) => {
            this.shadowRoot.addEventListener("click", this.#clickHandler);
            this.#tablist = this.shadowRoot.querySelector("tab-list");

            this.#tablist.addEventListener("change", this.#changeHandler);
            this.#availableList = this.shadowRoot.querySelector("[data-id='available']");
            this.#selectedList = this.shadowRoot.querySelector("[data-id='selected']");

            this.#currentView = TabViews.SELECTED;

            requestAnimationFrame(async () => {
                await crsbinding.translations.parseElement(this);
                await crs.call("component", "notify_ready", {element: this});

                if (this.dataset.drag === "true") {
                    await this.#addDragAndDrop();
                }
                resolve();
            });
        });
    }

    async disconnectedCallback() {
        await this.shadowRoot.removeEventListener("click", this.#clickHandler);
        this.#tablist.removeEventListener("change", this.#changeHandler);
        this.#clickHandler = null;
        this.#data = null
        this.#currentView = null;
        this.#tablist = null;
        this.#changeHandler = null;
        this.#availableList = null;

        if (this.dataset.drag === "true") {
            await this.#removeDragAndDrop();
        }
        this.#selectedList = null;
    }

    /**
     * @method #click - This method will handle the click event.
     * @param event {Object} - The click event.
     * @returns {Promise<void>}
     */
    async #click(event) {
        const target = event.target;
        if (target.dataset.action != null) {
            this[target.dataset.action] != null && await this[target.dataset.action](event);
        }
    }

    /**
     * @method changeTabView - fires on change event and set the current view to the new tab value and calls the hidden state method.
     * @param event {Object} - The event object.
     * @returns {Promise<void>}
     */
    async #changeTabView(event) {
        const view = event.detail.tab;
        if (this.#currentView !== view) {
            this.#currentView = view;
            await this.#setViewHiddenState();
        }
    }

    /**
     * @method renderList - This method will render the list of available and selected items based on the data passed in through the parameters.
     * @param data {Object} - The data object containing the available and selected items.
     * @returns {Promise<void>}
     */
    async renderList(data) {
        this.#data = data;
        const selectedFragment = await ItemsFactory.createTemplate(this, this.#currentView, TabViews.SELECTED, this.#data);
        const availableFragment = await ItemsFactory.createTemplate(this, this.#currentView, TabViews.AVAILABLE, this.#data);

        await this.#appendListElement(this.#selectedList, selectedFragment);
        await this.#appendListElement(this.#availableList, availableFragment);
    }

    /**
     * @method appendListElement - This method will append the list element to the list container.
     * @param listElement - The ul list element to append the list to.
     * @param fragment - The fragment(li) to append to the list container
     * @returns {Promise<void>}
     */
    async #appendListElement(listElement, fragment) {
        listElement.replaceChildren(fragment);
    }

    /**
     * @method setViewHiddenState - This method will set the hidden attribute on the selected or available container.
     * @returns {Promise<void>}
     */
    async #setViewHiddenState(){
        // the primary list is the list that is currently being viewed and the secondary list is the list that is not being viewed.
        if (this.#currentView === TabViews.SELECTED) {
            this.#selectedList.removeAttribute("hidden");
            this.#availableList.setAttribute("hidden", "true");
        }
        else {
            this.#availableList.removeAttribute("hidden");
            this.#selectedList.setAttribute("hidden", "true");
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

        const target = source === TabViews.AVAILABLE ? TabViews.SELECTED : TabViews.AVAILABLE;
        const value = this.#data[source].find(item => `${item[this.dataset.idField || "id"]}` === `${li.dataset.id}`);

        await crs.call("array", "transfer", {source: this.#data[source], target: this.#data[target], value: value});
        await this.renderList(this.#data);
    }

    /**
     * @method getSelectedItems - This method will return the selected items.
     * @returns {*}
     */
    getSelectedItems() {
        return this.#data.selected;
    }

    /**
     * @method #addDragAndDrop - This method will add the drag and drop functionality to the selected list.
     * @returns {Promise<void>}
     */
    async #addDragAndDrop() {
        if (this.#currentView === TabViews.SELECTED) {
            crsbinding.idleTaskManager.add(async () => {
                const target = this.#selectedList;

                await crs.call("dom_interactive", "enable_dragdrop", {
                    element: target,
                    options: {
                        drag: {
                            query: `[data-action="drag"]`,
                            cpIndex: 1
                        },
                        drop: {
                            allowDrop: async (target, options) => {
                                // drop check, only drop on container
                                if (options.currentAction == "drop") {
                                    if (target.tagName === "LI") {
                                        return {
                                            target,
                                            position: "before"
                                        }
                                    }

                                    if (target.parentElement && target.parentElement.tagName === "LI") {
                                        return {
                                            target: target.parentElement,
                                            position: "before"
                                        }
                                    }

                                    if (target.tagName !== "UL") {
                                        return null;
                                    }

                                    return {
                                        target: target,
                                        position: "append"
                                    }
                                }

                                // move operation allow marker to update on list items also
                                if (target.tagName === "LI" || target.tagName === "UL") {
                                    return {target};
                                }
                            },
                            callback: async (startIndex, endIndex, dragElement) => {
                                this.#data.selected.splice(endIndex, 0, ...this.#data.selected.splice(startIndex, 1));
                            }
                        }
                    }
                })
            });
        }
    }

    /**
     *  @method removeDragAndDrop - removes the drag and drop functionality from the selected list.
     * @returns {Promise<void>}
     */
    async #removeDragAndDrop() {
        await crs.call("dom_interactive", "disable_dragdrop", {
            element: this.#selectedList
        });
    }
}

customElements.define("available-selected", AvailableSelected);