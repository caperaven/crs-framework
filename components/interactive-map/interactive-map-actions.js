import "./interactive-map.js";
import {InteractiveMap} from "./interactive-map.js";

export class InteractiveMapActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    static async initialize_lib(step, context, process, item) {
        return new Promise(resolve => {
            requestAnimationFrame(async () => {
                const leafletScript = document.createElement('script');
                leafletScript.src = "/packages/leaflet/leaflet.js";
                leafletScript.onload = async () => {

                    resolve();
                }
                document.body.appendChild(leafletScript);
            });
        });
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

    static async add_polyline(step, context, process, item) {
        const map = await getMap(step, context, process, item);
        const coordinates = await crs.process.getValue(step.args.coordinates, context, process, item);

        const polygon = L.polyline(coordinates, {color: 'red'}).addTo(map);
        polygon.type = "polyline";
        return polygon;
    }

    static async add_rectangle(step, context, process, item) {
        const map = await getMap(step, context, process, item);
        const coordinates = await crs.process.getValue(step.args.coordinates, context, process, item);
        const rectangle = L.rectangle(coordinates, {color: 'blue'}).addTo(map);
        rectangle.type = "rectangle";
        return rectangle;
    }

    static async add_drag_handle(step, context, process, item) {
        const map = await getMap(step, context, process, item);
        const coordinates = await crs.process.getValue(step.args.coordinates, context, process, item);
        const options = await crs.process.getValue(step.args.options || {}, context, process, item);

        const customIcon = L.divIcon({
            className: 'marker',
            html: "<div class='handle'></div>",
            iconSize: [16, 16], // Size of the icon
            iconAnchor: [8, 8] // Point of the icon which will correspond to marker's location
        });
        const marker = L.marker(coordinates, {icon: customIcon, draggable: true, ...options}).addTo(map);
        return marker;
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