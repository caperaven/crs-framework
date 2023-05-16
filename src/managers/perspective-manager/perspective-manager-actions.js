class PerspectiveManagerActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * @method register - register on the perspective manager
     * @param step {object} - the step to perform
     * @param context {object} - the context of the step
     * @param process {object} - the process
     * @param item {object} - the item
     * @returns {Promise<void>}
     */
    static async register(step, context, process, item) {
        const perspective = await crs.process.getValue(step.args.perspective, context, process, item);
        if (perspective == null) return;

        if (globalThis.perspectives == null) {
            globalThis.perspectives = {};
        }

        if (globalThis.perspectives[perspective] == null) {
            globalThis.perspectives[perspective] = {
                count: 1
            };
        }
        else {
            globalThis.perspectives[perspective].count += 1;
        }
    }

    /**
     * @method unregister - unregister from the perspective manager
     * @param step {object} - the step to perform
     * @param context {object} - the context of the step
     * @param process {object} - the process
     * @param item {object} - the item
     * @returns {Promise<void>}
     */
    static async unregister(step, context, process, item) {
        const perspective = await crs.process.getValue(step.args.perspective, context, process, item);
        if (perspective == null) return;

        const definition = globalThis.perspectives[perspective];
        if (definition == null) return;

        definition.count -= 1;
        if (definition.count === 0) {
            delete globalThis.perspectives[perspective];
        }
    }

    static async add_filter(step, context, process, item) {
        const perspective = await crs.process.getValue(step.args.perspective, context, process, item);
        const field = await crs.process.getValue(step.args.field, context, process, item);
        const operator = await crs.process.getValue(step.args.operator, context, process, item);
        const value = await crs.process.getValue(step.args.value, context, process, item);

        const definition = globalThis.perspectives[perspective];
        definition.filter ||= {};
        definition.filter[field] ||= {}
        definition.filter[field].operator = operator;
        definition.filter[field].value = value;

        await notifyPerspectiveChanged(perspective);
    }

    static async remove_filter(step, context, process, item) {
        const perspective = await crs.process.getValue(step.args.perspective, context, process, item);

        const definition = globalThis.perspectives[perspective];
        if (definition == null) return;

        const field = await crs.process.getValue(step.args.field, context, process, item);
        delete definition.filter[field];

        if (Object.keys(definition.filter).length === 0) {
            delete definition.filter;
        }

        await notifyPerspectiveChanged(perspective);
    }

    static async set_grouping(step, context, process, item) {
        const perspective = await crs.process.getValue(step.args.perspective, context, process, item);

        const definition = globalThis.perspectives[perspective];
        if (definition == null) return;

        const fields = await crs.process.getValue(step.args.fields, context, process, item);
        definition.grouping = fields;

        await notifyPerspectiveChanged(perspective);
    }

    static async expand_grouping(step, context, process, item) {
        const perspective = await crs.process.getValue(step.args.perspective, context, process, item);
    }

    static async collapse_grouping(step, context, process, item) {
        const perspective = await crs.process.getValue(step.args.perspective, context, process, item);
    }
}

/**
 * @method notifyPerspectiveChanged - notify the perspective manager that a perspective has changed
 * @param perspective
 * @returns {Promise<void>}
 */
export async function notifyPerspectiveChanged(perspective) {
    if (globalThis.dataManagers == null) return;

    for (const key of Object.keys(globalThis.dataManagers)) {
        const dataManager = globalThis.dataManagers[key];
        if (dataManager.perspective === perspective) {
            await dataManager.perspectiveChanged();
        }
    }
}

crs.intent.perspective = PerspectiveManagerActions;