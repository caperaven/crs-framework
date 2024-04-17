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

    static async initialize(step, context, process, item) {
        const instance = await crs.dom.get_element(step, context, process, item);

        if(globalThis.L == null) {
            await this.initialize_lib(step, context, process, item);
        }
        await instance.initialize();
    }

    static async set_colors(step, context, process, item) {
        const map = await getMap(step, context, process, item);
        const strokeColor = await crs.process.getValue(step.args.stroke_color, context, process, item);
        const fillColor = await crs.process.getValue(step.args.fill_color, context, process, item);

        if (strokeColor != null) {
            map.strokeColor = strokeColor;
            if (map.selectedShape != null) {
                map.selectedShape.setStyle({color: strokeColor});
            }
        }

        if (fillColor != null) {
            map.fillColor = fillColor;

            if (map.selectedShape != null) {
                map.selectedShape.setStyle({fillColor: fillColor});
            }
        }
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

    static async add_geo_json(step, context, process, item) {
        const map = await getMap(step, context, process, item);
        const data = await crs.process.getValue(step.args.data, context, process, item);
        const options = await crs.process.getValue(step.args.options || {}, context, process, item);

        const geoJson = L.geoJSON(data, {...options}).addTo(map);
        return geoJson;
    }

    static async add_point(step, context, process, item) {
        const map = await getMap(step, context, process, item);
        const coordinates = await crs.process.getValue(step.args.coordinates, context, process, item);
        const iconName = await crs.process.getValue(step.args.icon_name || "location-pin", context, process, item);
        const options = await crs.process.getValue(step.args.options || {}, context, process, item);

        const customIcon = L.divIcon({
            className: 'marker',
            html: `<div class="point">${iconName}</div>`,
            iconSize: [32, 32], // Size of the icon
            iconAnchor: [16, 32] // Point of the icon which will correspond to marker's location
        });
        const marker = L.marker(coordinates, {icon: customIcon,  ...options}).addTo(map);
        marker.type = "point";
        return marker;
    }

    static async add_polygon(step, context, process, item) {
        const map = await getMap(step, context, process, item);
        const coordinates = await crs.process.getValue(step.args.coordinates, context, process, item);

        const colors = await getColorData(step, context, process, item, map);

        const polygon = L.polygon(coordinates, {...colors}).addTo(map);
        polygon.type = "polygon";
        return polygon;
    }

    static async add_polyline(step, context, process, item) {
        const map = await getMap(step, context, process, item);
        const coordinates = await crs.process.getValue(step.args.coordinates, context, process, item);

        const colors = await getColorData(step, context, process, item, map);

        const polygon = L.polyline(coordinates, {...colors}).addTo(map);
        polygon.type = "polyline";
        return polygon;
    }

    static async add_rectangle(step, context, process, item) {
        const map = await getMap(step, context, process, item);
        const coordinates = await crs.process.getValue(step.args.coordinates, context, process, item);


        const rectangle = L.rectangle(coordinates, { fillColor, color: strokeColor, weight: strokeWeight}).addTo(map);
        rectangle.type = "rectangle";
        return rectangle;
    }

    static async add_handle(step, context, process, item) {
        const map = await getMap(step, context, process, item);
        const coordinates = await crs.process.getValue(step.args.coordinates, context, process, item);
        const options = await crs.process.getValue(step.args.options || {}, context, process, item);
        const type = await crs.process.getValue(step.args.type || "drag", context, process, item);

        const customIcon = L.divIcon({
            className: 'marker',
            html: `<div class="handle" data-type='${type}' data-index="${options.index}"></div>`,
            iconSize: [16, 16], // Size of the icon
            iconAnchor: [8, 8] // Point of the icon which will correspond to marker's location
        });
        const marker = L.marker(coordinates, {icon: customIcon,  ...options}).addTo(map);
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

async function getColorData(step, context, process, item, map) {

    const fillColor = await crs.process.getValue(step.args.fill_color, context, process, item);
    const strokeColor = await crs.process.getValue(step.args.stroke_color, context, process, item);
    const strokeWeight = await crs.process.getValue(step.args.stroke_weight, context, process, item);

    return {
        fillColor: fillColor || map.fillColor,
        color: strokeColor || map.strokeColor,
        weight: strokeWeight || 2
    }
}


crs.intent.interactive_map = InteractiveMapActions;