import {SelectionManager} from "../managers/selection-manager/selection-manager.js";

export class SelectionActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * Enables the selection-manager on the parent container element which will manage the toggling of a master checkbox and its dependent checkboxes.
     * @param step {object} - The step object.
     * @param context {object} - The context object.
     * @param process {object} - The current process object.
     * @param item {object} - The item object.
     *
     * @param step.args.element {HTMLElement} - The parent container who needs to listen for click events
     * @param step.args.masterQuery {string} - The query selector for the master checkbox
     * @param step.args.selectionQuery {string} - The query selector for the dependent checkboxes
     * @returns {Promise<void>}
     */
    static async enable(step, context, process, item) {
        const element = await crs.dom.get_element(step, context, process, item);
        const masterQuery = await crs.process.getValue(step.args.master_query, context, process, item);
        const masterSelectionQuery = await crs.process.getValue(step.args.master_selection_query, context, process, item);
        const masterAttribute = await crs.process.getValue(step.args.master_attribute, context, process, item);
        const itemQuery = await crs.process.getValue(step.args.item_query, context, process, item);
        const itemSelectionQuery = await crs.process.getValue(step.args.item_selection_query, context, process, item);
        const itemAttribute = await crs.process.getValue(step.args.item_attribute, context, process, item);

        element.__selectionManager = new SelectionManager(element, masterQuery, masterSelectionQuery, masterAttribute, itemQuery, itemSelectionQuery, itemAttribute);
    }

    /**
     * Disables the selection-manager on the parent container element if one is found.
     * @param step {object} - The step object.
     * @param context {object} - The context object.
     * @param process {object} - The current process object.
     * @param item {object} - The item object.
     *
     * @param step.args.element {HTMLElement} - The parent container where the eventListener needs to be removed
     * @returns {Promise<void>}
     */
    static async disable(step, context, process, item) {
        const element = await crs.dom.get_element(step, context, process, item);

        if (element.__selectionManager) {
            element.__selectionManager = element.__selectionManager.dispose();
        }
    }
}

crs.intent.selection = SelectionActions;