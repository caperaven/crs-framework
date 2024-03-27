import "./interactive-map.js";

export class InteractiveMapActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    static async set_mode(step, context, process, item) {
        const instance = await crs.dom.get_element(step, context, process, item);
        const mode = await crs.process.getValue(step.args.mode, context, process, item);

        if (instance.currentMode != null) {
            instance.currentMode.dispose(instance);
            instance.currentMode = null;
        }

        const modeClass = await getModeProvider(mode);
        instance.currentMode = await modeClass;
        await modeClass.initialize(instance.map);
    }
}

async function getModeProvider(mode) {
    const module = await import(`./providers/${mode}.js`);
    return new module.default();
}

crs.intent.interactive_map = InteractiveMapActions;