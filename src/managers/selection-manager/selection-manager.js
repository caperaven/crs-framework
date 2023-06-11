/**
 * @class SelectionManager - This class manages the selection of a tri-state checkbox, and its dependent checkboxes.
 * Will listen for click events on the container element and update the respective checkboxes accordingly
 * i.e. If the master checkbox is clicked, all dependent checkboxes will be updated accordingly.
 * If a dependent checkbox is clicked, the master checkbox will be updated accordingly.
 */
export class SelectionManager {
    #containerElement;
    #masterQuery;
    #selectionQuery;
    #clickHandler = this.#click.bind(this);

    /**
     * @constructor
     * @param element - the element that contains the collection of items and that will also limit the query selection for UI
     * @param masterQuery - the query that will be used to determine if an element is a master element (select all or none)
     * @param selectionQuery - the query that will be used to determine if an element is a selection element (select one)
     */
    constructor(element, masterQuery, selectionQuery) {
        this.#containerElement = element;
        this.#masterQuery = masterQuery;
        this.#selectionQuery = selectionQuery;
        this.#containerElement.addEventListener("click", this.#clickHandler);
    }

    dispose() {
        this.#containerElement.removeEventListener("click", this.#clickHandler);
        this.#clickHandler = null;
        this.#containerElement = null;
        this.#masterQuery = null;
        this.#selectionQuery = null;
    }

    /**
     * Click event handler. Will check the event.target to see if it is a master or selection element and update the checkboxes accordingly.
     * @param event {MouseEvent} - the click event
     * @returns {Promise<void>}
     */
    async #click(event) {
        //check if we're clicking the master or a selection element
        const checkbox = getItem(event.composedPath()[0]);
        if (checkbox == null) return;

        //get the state of the selectable item
        const checked = checkbox.getAttribute("aria-checked") === "true";

        //if we're clicking the master element, update all the selection elements
        if (checkbox.matches(this.#masterQuery)) {
            await this.#setMasterState(checked, checkbox);
        }

        //if we're clicking a selection element, update the master element
        if (checkbox.matches(this.#selectionQuery)) {
            await this.#setDependentState(checked, checkbox);
            await this.#checkDependentsState();
        }
    }

    /**
     * Sets the state of the master checkbox, and all dependent checkboxes.
     * @param checked {boolean} - the state to set the master checkbox to
     * @param checkbox {HTMLElement} - the master checkbox
     * @returns {Promise<void>}
     */
    async #setMasterState(checked, checkbox) {
        checkbox.checked = checked;

        await this.#setDependentsState(checked);
    }

    /**
     * Goes through the dependent checkboxes checking which are checked.
     * If all are checked, the master checkbox will be checked.
     * If none are checked, the master checkbox will be unchecked.
     * If some are checked, the master checkbox will be indeterminate.
     * @returns {Promise<void>}
     */
    async #checkDependentsState() {
        const dependents = this.#containerElement.querySelectorAll(this.#selectionQuery);
        if (dependents == null) return;

        let allChecked = true;
        let allUnchecked = true;
        for (const dependent of dependents) {
            const checked = dependent.getAttribute("aria-checked") === "true";
            allChecked = allChecked && checked;
            allUnchecked = allUnchecked && !checked;
        }

        const master = this.#containerElement.querySelector(this.#masterQuery);

        if (allChecked) {
            master.checked = true;
        }

        if (allUnchecked) {
            master.checked = false;
        }

        if (!allChecked && !allUnchecked) {
            master.checked = "mixed";
        }
    }

    /**
     * Sets the state of all dependent checkboxes.
     * @param checked {boolean} - the state to set the dependent checkboxes to
     * @returns {Promise<void>}
     */
    async #setDependentsState(checked) {
        const dependents = this.#containerElement.querySelectorAll(this.#selectionQuery);
        if (dependents == null) return;

        for (const dependent of dependents) {
            await this.#setDependentState(checked, dependent);
        }
    }

    /**
     * Sets the state of a dependent checkbox.
     * @param checked {boolean} - the state to set the dependent checkbox to
     * @param checkbox {HTMLElement} - the dependent checkbox
     * @returns {Promise<void>}
     */
    async #setDependentState(checked, checkbox) {
        checkbox.checked = checked;
    }
}

/**
 * Gets the check-box element from the event target.
 * @param element {HTMLElement} - the event target
 * @returns {*|null}
 */
function getItem(element) {
    if (element.matches("check-box")) {
        return element;
    }

    const shadowRoot = element.getRootNode();
    if (shadowRoot.host == null) return null;

    if (shadowRoot.host.matches("check-box")) {
        return shadowRoot.host;
    }

    return null;
}