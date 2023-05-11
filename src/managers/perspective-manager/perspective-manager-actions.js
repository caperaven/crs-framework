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
    }

    static async remove_filter(step, context, process, item) {
        const perspective = await crs.process.getValue(step.args.perspective, context, process, item);
        const field = await crs.process.getValue(step.args.field, context, process, item);

        const definition = globalThis.perspectives[perspective];
        if (definition == null) return;

        delete definition.filter[field];

        if (Object.keys(definition.filter).length === 0) {
            delete definition.filter;
        }
    }
}

crs.intent.perspective = PerspectiveManagerActions;