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
        this.attachShadow({mode: "open"});
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch(this.html).then(result => result.text());
        this.innerHTML = await fetch(import.meta.url.replace(".js", ".lightdom.html")).then(res => res.text());
        await this.load();
    }

    async load() {
        requestAnimationFrame(async () => {
            this.shadowRoot.addEventListener("click", this.#clickHandler);
            this.#tablist = this.shadowRoot.querySelector("tab-list");
            this.#currentView = "selected";
            await crs.binding.translations.parseElement(this);
            await crs.call("component", "notify_ready", {element: this});
        })
    }

    async disconnectedCallback() {
        await this.shadowRoot.removeEventListener("click", this.#clickHandler);
        this.#clickHandler = null;
        this.#data = null
        this.#currentView = null;
        this.#tablist = null;
        if (this.dataset.drag === "true") {
            await this.#removeDragAndDrop();
        }
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
        await this.update(this.#data, false);
    }

    /**
     * @method update - This method will update the data for the component.
     * @param data {Object} - The data to update the component with.
     * @returns {Promise<void>}
     */
    async update(data, resetView = true) {
        this.#data = data;
        const selectedTemplate = await ItemsFactory.createTemplate(this, this.#currentView, "selected", this.#data);
        const availableTemplate = await ItemsFactory.createTemplate(this, this.#currentView, "available", this.#data);

        if (this.#perspectiveElement != null) {
            if (this.dataset.drag === "true") {
                await this.#removeDragAndDrop();
            }
            this.shadowRoot.removeChild(this.#perspectiveElement);
            this.#perspectiveElement = await this.#perspectiveElement?.dispose();
        }

        const perspectiveElement = document.createElement("perspective-element");

        perspectiveElement.appendChild(selectedTemplate);
        perspectiveElement.appendChild(availableTemplate);
        perspectiveElement.dataset.store = perspectiveElement._dataId;


        this.shadowRoot.appendChild(perspectiveElement);
        this.#perspectiveElement = perspectiveElement;
        this.#tablist.target = this.#perspectiveElement;

        if (resetView === true) {
            this.#currentView = "selected";
            await this.#tablist.selectTab(this.#currentView);
        }

        if (this.dataset.drag === "true") {
            await this.#addDragAndDrop();
        }
    }

    /**
     * @method getSelectedItems - This method will return the selected items.
     * @returns {*}
     */
    getSelectedItems() {
        return this.#data.selected;
    }

    async #addDragAndDrop() {
        if (this.#perspectiveElement.view === "selected") {
            crs.binding.idleTaskManager.add(async () => {
                const target = this.#perspectiveElement.querySelector("ul");

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

    async #removeDragAndDrop() {
        await crs.call("dom_interactive", "disable_dragdrop", {
            element: this.#perspectiveElement.querySelector("ul"),
        });
    }
}

customElements.define("available-selected", AvailableSelected);