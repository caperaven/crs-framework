/**
 * @class CollectionSelectionManager - this class is a mediator between the data manager and the UI
 * It will check for UI interactions and update the data manager accordingly.
 * It will also listen to the data manager and update the UI accordingly.
 * For examples if the selection changes on the data manager it must also show on the UI.
 * This does not affect the record count or filter, only the management and indication of selection states
 */
export class CollectionSelectionManager {
    #containerElement;
    #masterQuery;
    #selectionQuery;
    #groupQuery;
    #manager;
    #clickHandler = this.#click.bind(this);

    /**
     * @constructor
     * @param element - the element that contains the collection of items and that will also limit the query selection for UI
     * @param masterQuery - the query that will be used to determine if an element is a master element (select all or none)
     * @param selectionQuery - the query that will be used to determine if an element is a selection element (select one)
     * @param manager - the data manager that will be used to update the selection state
     */
    constructor(element, masterQuery, selectionQuery, groupQuery, manager) {
        this.#containerElement = element;
        this.#masterQuery = masterQuery;
        this.#selectionQuery = selectionQuery;
        this.#groupQuery = groupQuery;
        this.#manager = manager;
        this.#containerElement.addEventListener("click", this.#clickHandler);
    }

    dispose() {
        this.#containerElement.removeEventListener("click", this.#clickHandler);
        this.#clickHandler = null;
        this.#containerElement = null;
        this.#masterQuery = null;
        this.#selectionQuery = null;
        this.#manager = null;
        this.#groupQuery = null;
        return null;
    }

    #isMasterElement(element) {
        return element.matches(this.#masterQuery);
    }

    #isSelectionElement(element) {
        return element.matches(this.#selectionQuery);
    }

    #isGroupElement(element) {
        // if you select a element and it is a group checkbox then use the "group_selected" instead of the "selected"
        return element.dataset.group !== undefined;
    }

    async #click(event) {
        const checkbox = getCheckbox(event.composedPath()[0]);
        const checked = checkbox.getAttribute("aria-checked") === "true";
        const id = checkbox.dataset.id;
        const index = checkbox.dataset.index;

        if (this.#isMasterElement(checkbox)) {
            return await this.#selectedAll(checked);
        }

        if (this.#isSelectionElement(checkbox)) {
            return await this.#selected(checkbox, id, index, checked);
        }
    }

    /**
     * Mark all the records as selected or not selected based on the checked value
     * @param checked {boolean} - true if all records should be selected, false if all records should be unselected
     */
    async #selectedAll(checked) {
        await crs.call("data_manager", "set_select_all", {
            manager: this.#manager,
            selected: checked
        })

        console.log(await crs.call("data_manager", "get_selected", { manager: this.#manager }));
    }

    /**
     * Mark all the records for a group
     * @param groupId
     * @param checked
     * @returns {Promise<void>}
     */
    async #selectedGroup(element, checked) {
    }

    async #selected(element, id, index, checked) {
    }
}

function getCheckbox(element) {
    if (element.matches("check-box")) {
        return element;
    }

    const shadowRoot = element.getRootNode();
    const checkbox = shadowRoot.host;
    return checkbox;
}