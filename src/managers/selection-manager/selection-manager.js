/**
 * @class SelectionManager - This class manages the selection of a tri-state checkbox, and its dependent items.
 * Will listen for click events on the container element and update the respective items accordingly
 * i.e. If the master checkbox is clicked, all dependent items will be updated accordingly.
 * If a dependent item is clicked, the master checkbox will be updated accordingly.
 */
export class SelectionManager {
    #containerElement;
    #masterQuery;
    #masterSelectionQuery;
    #masterAttribute;
    #itemQuery;
    #itemSelectionQuery;
    #itemAttribute;
    #clickHandler = this.#click.bind(this);

    /**
     * @constructor
     * @param element - the element that contains the collection of items and that will also limit the query selection for UI
     * @param masterQuery - the query that will be used to determine if an element is a master element (select all or none)
     * @param selectionQuery - the query that will be used to determine if an element is a selection element (select one)
     */
    constructor(element, masterQuery, masterSelectionQuery, masterAttribute, itemQuery, itemSelectionQuery, itemAttribute) {
        this.#containerElement = element;
        this.#masterQuery = masterQuery;
        //Chuck masterSelectionQuery and itemSelectionQuery
        this.#masterSelectionQuery = masterSelectionQuery;
        this.#masterAttribute = masterAttribute;
        this.#itemQuery = itemQuery;
        this.#itemSelectionQuery = itemSelectionQuery;
        this.#itemAttribute = itemAttribute;
        this.#containerElement.addEventListener("click", this.#clickHandler);
    }

    dispose() {
        this.#containerElement.removeEventListener("click", this.#clickHandler);
        this.#clickHandler = null;
        this.#containerElement = null;
        this.#masterQuery = null;
        this.#masterSelectionQuery = null;
        this.#masterAttribute = null;
        this.#itemQuery = null;
        this.#itemSelectionQuery = null;
        this.#itemAttribute = null;
    }

    /**
     * Click event handler. Will check the event to see if it is a master or selection element and update the items accordingly.
     * @param event {MouseEvent} - the click event
     * @returns {Promise<void>}
     */
    async #click(event) {
        const triggeredElement = this.#getElement(event);
        if (triggeredElement == null) return;

        if (triggeredElement.matches(this.#masterQuery)) {
            const checked = triggeredElement.getAttribute(this.#masterAttribute) === "true";
            //check if triggeredElement is a check-box element, if so, update dependent items
            if (!triggeredElement.matches("check-box")) {
                await this.#setMasterState(!checked, triggeredElement);
                await this.#setDependentsState(!checked);
            } else {
                await this.#setDependentsState(checked);
            }
        }

        if (triggeredElement.matches(this.#itemQuery)) {
            const checked = triggeredElement.getAttribute(this.#itemAttribute) === "true";
            await this.#setDependentState(!checked, triggeredElement);
            await this.#checkDependentsState();
        }


        // //check if we're clicking the master or a selection element
        // const checkbox = getItem(event.composedPath()[0]);
        // if (checkbox == null) return;
        //
        // //get the state of the selectable item
        // const checked = checkbox.getAttribute("aria-checked") === "true";
        //
        // //if we're clicking the master element, update all the selection elements
        // if (checkbox.matches(this.#masterQuery)) {
        //     await this.#setMasterState(checked, checkbox);
        // }
        //
        // //if we're clicking a selection element, update the master element
        // if (checkbox.matches(this.#selectionQuery)) {
        //     await this.#setDependentState(checked, checkbox);
        //     await this.#checkDependentsState();
        // }
    }

    #getElement(event) {
        const element = event.composedPath()[0];
        if (element.matches(this.#masterQuery) || element.matches(this.#itemQuery)) return element;

        const shadowRoot = element.getRootNode();
        if (shadowRoot.host == null) return null;

        if (shadowRoot.host.matches(this.#masterQuery) || shadowRoot.host.matches(this.#itemQuery)) return shadowRoot.host;

        return null;
    }

    /**
     * Sets the state of the master checkbox, and all dependent items.
     * @param checked {boolean} - the state to set the master checkbox to
     * @param checkbox {HTMLElement} - the master checkbox
     * @returns {Promise<void>}
     */
    async #setMasterState(checked, element) {
        if (element.matches("check-box")) {
            element.checked = checked;
        } else {
            element.setAttribute(this.#masterAttribute, checked);
        }
    }

    /**
     * Goes through the dependent checkboxes checking which are checked.
     * If all are checked, the master checkbox will be checked.
     * If none are checked, the master checkbox will be unchecked.
     * If some are checked, the master checkbox will be indeterminate.
     * @returns {Promise<void>}
     */
    async #checkDependentsState() {
        const dependents = this.#containerElement.querySelectorAll(this.#itemQuery);
        if (dependents == null) return;

        let allChecked = true;
        let allUnchecked = true;
        for (const dependent of dependents) {
            const checked = dependent.getAttribute(this.#itemAttribute) === "true";
            allChecked = allChecked && checked;
            allUnchecked = allUnchecked && !checked;
        }

        const master = this.#containerElement.querySelector(this.#masterQuery);

        if (allChecked) {
            await this.#setMasterState(true, master);

            // if (master.matches("check-box")) {
            //     master.checked = true;
            // } else {
            //     master.setAttribute(this.#masterAttribute, true);
            // }
        }

        if (allUnchecked) {
            await this.#setMasterState(false, master);

            // if (master.matches("check-box")) {
            //     master.checked = false;
            // } else {
            //     master.setAttribute(this.#masterAttribute, false);
            // }
        }

        if (!allChecked && !allUnchecked) {
            await this.#setMasterState("mixed", master);

            // if (master.matches("check-box")) {
            //     master.checked = "mixed";
            // } else {
            //     master.setAttribute(this.#masterAttribute, "mixed");
            // }
        }
    }

    /**
     * Sets the state of all dependent checkboxes.
     * @param checked {boolean} - the state to set the dependent checkboxes to
     * @returns {Promise<void>}
     */
    async #setDependentsState(checked) {
        const dependents = this.#containerElement.querySelectorAll(this.#itemQuery);
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
    async #setDependentState(checked, element) {
        element.setAttribute(this.#itemAttribute, checked);
    }
}