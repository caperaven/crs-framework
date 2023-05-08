import {CollectionSelectionManager} from "./managers/collection-selection-manager.js";

export class CollectionSelectionActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    static async enable(step, context, process, item) {
        const element = await crs.dom.get_element(step, context, process, item);
        const selectionQuery = await crs.process.getValue(step.args.selectionQuery, context, process, item);
        const masterQuery = await crs.process.getValue(step.args.masterQuery, context, process, item);
        const groupQuery = await crs.process.getValue(step.args.groupQuery, context, process, item);
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        element.__collectionSelectionManager = new CollectionSelectionManager(element, master, query, groupQuery, manager);
    }

    static async disable(step, context, process, item) {
        const element = await crs.dom.get_element(step, context, process, item);

        if (element.__collectionSelectionManager) {
            element.__collectionSelectionManager = element.__collectionSelectionManager.dispose();
        }
    }
}