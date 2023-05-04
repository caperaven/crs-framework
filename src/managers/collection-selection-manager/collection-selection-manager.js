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
    #manager;

    /**
     * @constructor
     * @param element - the element that contains the collection of items and that will also limit the query selection for UI
     * @param masterQuery - the query that will be used to determine if an element is a master element (select all or none)
     * @param selectionQuery - the query that will be used to determine if an element is a selection element (select one)
     * @param manager - the data manager that will be used to update the selection state
     */
    constructor(element, masterQuery, selectionQuery, manager) {
        this.#containerElement = element;
        this.#masterQuery = masterQuery;
        this.#selectionQuery = selectionQuery;
        this.#manager = manager;
    }

    dispose() {
        this.#containerElement = null;
        this.#masterQuery = null;
        this.#selectionQuery = null;
        this.#manager = null;
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
}