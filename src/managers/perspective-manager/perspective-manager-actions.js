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

    static async get(step, context, process, item) {
        const perspective = await crs.process.getValue(step.args.perspective, context, process, item);
        if (perspective == null) return;

        return JSON.parse(JSON.stringify(globalThis.perspectives[perspective]));
    }
}

crs.intent.perspective = PerspectiveManagerActions;