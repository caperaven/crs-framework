import "./interactive-map.js";
import {InteractiveMap} from "./interactive-map.js";

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

        if (mode === "none" || mode == null) {
            return;
        }

        const modeClass = await getModeProvider(mode);
        instance.currentMode = await modeClass;
        await modeClass.initialize(instance.map);
    }

    static async add_point(step, context, process, item) {
        const instance = await crs.dom.get_element(step, context, process, item);
        const coordinates = await crs.process.getValue(step.args.coordinates, context, process, item);
        const marker = L.marker(coordinates).addTo(instance.map);
    }

    static async add_polygon(step, context, process, item) {
        const map = await getMap(step, context, process, item);
        const coordinates = await crs.process.getValue(step.args.coordinates, context, process, item);

        const polygon = L.polygon(coordinates, {color: 'red'}).addTo(map);
        polygon.type = "polygon";
        return polygon;
    }

    static async add_rectangle(step, context, process, item) {
        const map = await getMap(step, context, process, item);
        const coordinates = await crs.process.getValue(step.args.coordinates, context, process, item);
        const rectangle = L.rectangle(coordinates, {color: 'blue'}).addTo(map);
        rectangle.type = "rectangle";
        return rectangle;
    }
}

async function getModeProvider(mode) {
    const module = await import(`./providers/${mode}.js`);
    return new module.default();
}

async function getMap(step, context, process, item) {
    const instance = await crs.dom.get_element(step, context, process, item);
    return instance instanceof InteractiveMap ? instance.map : instance;
}

crs.intent.interactive_map = InteractiveMapActions;