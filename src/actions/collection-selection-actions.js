import {CollectionSelectionManager} from "./managers/collection-selection-manager.js";

export class CollectionSelectionActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    static async enable(step, context, process, item) {
        const element = await crs.dom.get_element(step, context, process, item);
        const query = await crs.process.getValue(step.args.query, context, process, item);
        const master = await crs.process.getValue(step.args.master, context, process, item);
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        element.__collectionSelectionManager = new CollectionSelectionManager(element, master, query, manager);
    }

    static async disable(step, context, process, item) {
        const element = await crs.dom.get_element(step, context, process, item);

        if (element.__collectionSelectionManager) {
            element.__collectionSelectionManager = element.__collectionSelectionManager.dispose();
        }
    }
}