export class InteractiveMapActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    static initialize_lib(step, context, process, item) {
        return new Promise(resolve => {
            if (globalThis.L == null) {

                requestAnimationFrame(async () => {
                    const leafletScript = document.createElement('script');
                    leafletScript.src = "/packages/leaflet/leaflet.js";
                    leafletScript.onload = async () => {

                        resolve();
                    }
                    document.body.appendChild(leafletScript);
                });
            } else {
                resolve();
            }
        });
    }

    static async initialize(step, context, process, item) {
        const instance = await crs.dom.get_element(step, context, process, item);
        const defaultLayer = await crs.process.getValue(step.args.default_layer, context, process, item);
        await instance.initialize();
        instance.defaultLayer = defaultLayer;
    }

    static async set_colors(step, context, process, item) {
        const map = await getMap(step, context, process, item);
        const strokeColor = await crs.process.getValue(step.args.stroke_color || "#0276C2", context, process, item);
        const fillColor = await crs.process.getValue(step.args.fill_color || "#0276C2", context, process, item);

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
        await modeClass.initialize(instance);
    }

    static async set_view_to_shape(step, context, process, item) {
        const instance = await crs.dom.get_element(step, context, process, item);
        const shape = await crs.process.getValue(step.args.shape, context, process, item);
        const map = instance.map;

        if (shape != null) {
            map.fitBounds(shape.getBounds());
        }
    }

    static async add_geo_json(step, context, process, item) {
        const instance = await crs.dom.get_element(step, context, process, item);
        const map = instance.map;
        const data = await crs.process.getValue(step.args.data, context, process, item);
        const moveTo = await crs.process.getValue(step.args.move_to || true, context, process, item);
        const replace = await crs.process.getValue(step.args.replace || false, context, process, item);
        const options = await crs.process.getValue(step.args.options || {}, context, process, item);

        const layerName = await crs.process.getValue(step.args.layer || instance.defaultLayer, context, process, item);

        if (replace) {
            await crs.call("interactive_map", "remove_layer_if_exists", {layer: layerName, element: instance});
        }

        const geoJson = L.geoJSON(data, {...options}).addTo(map);

        if (moveTo) {
            await crs.call("interactive_map", "set_view_to_shape", {element: instance, shape: geoJson});
        }

        geoJson.layer_name = layerName;

        return geoJson;
    }

    static async add_point(step, context, process, item) {
        const instance = await crs.dom.get_element(step, context, process, item);
        const map = instance.map;
        const coordinates = await crs.process.getValue(step.args.coordinates, context, process, item);
        const iconName = await crs.process.getValue(step.args.icon_name || "location-pin", context, process, item);
        const options = await crs.process.getValue(step.args.options || {}, context, process, item);
        const layerName = await crs.process.getValue(step.args.layer || instance.defaultLayer, context, process, item);

        const customIcon = L.divIcon({
            className: 'marker',
            html: `<div class="point">${iconName}</div>`,
            iconSize: [32, 32], // Size of the icon
            iconAnchor: [16, 32] // Point of the icon which will correspond to marker's location
        });
        const marker = L.marker(coordinates, {icon: customIcon, ...options}).addTo(map);
        marker.type = "point";
        marker.layer_name = layerName;
        return marker;
    }

    static async add_polygon(step, context, process, item) {
        const instance = await crs.dom.get_element(step, context, process, item);
        const map = instance.map;
        const coordinates = await crs.process.getValue(step.args.coordinates, context, process, item);
        const layerName = await crs.process.getValue(step.args.layer || instance.defaultLayer, context, process, item);

        const colors = await getColorData(step, context, process, item, map);

        const polygon = L.polygon(coordinates, {...colors}).addTo(map);
        polygon.type = "polygon";
        polygon.layer_name = layerName;
        return polygon;
    }

    static async add_polyline(step, context, process, item) {
        const instance = await crs.dom.get_element(step, context, process, item);
        const map = instance.map;
        const coordinates = await crs.process.getValue(step.args.coordinates, context, process, item);
        const layerName = await crs.process.getValue(step.args.layer || instance.defaultLayer, context, process, item);

        const colors = await getColorData(step, context, process, item, map);

        const polygon = L.polyline(coordinates, {...colors}).addTo(map);
        polygon.type = "polyline";
        polygon.layer_name = layerName;
        return polygon;
    }

    static async add_handle(step, context, process, item) {
        const instance = await crs.dom.get_element(step, context, process, item);
        const map = instance.map;
        const coordinates = await crs.process.getValue(step.args.coordinates, context, process, item);
        const options = await crs.process.getValue(step.args.options || {}, context, process, item);
        const type = await crs.process.getValue(step.args.type || "drag", context, process, item);

        const customIcon = L.divIcon({
            className: 'marker',
            html: `<div class="handle" data-type='${type}' data-index="${options.index}"></div>`,
            iconSize: [16, 16], // Size of the icon
            iconAnchor: [8, 8] // Point of the icon which will correspond to marker's location
        });
        const marker = L.marker(coordinates, {icon: customIcon, ...options}).addTo(map);
        return marker;
    }

    static async show_drawing_tools(step, context, process, item) {
        const instance = await crs.dom.get_element(step, context, process, item);

        await import("./interactive-map-draw-toolbar/interactive-map-draw-toolbar.js");

        const toolbar = document.createElement("interactive-map-draw-toolbar");
        toolbar.slot = "drawing-tools";

        instance.appendChild(toolbar);

        await toolbar.setInstance(instance);
    }

    static async remove_selected(step, context, process, item) {
        const instance = await crs.dom.get_element(step, context, process, item);


        if (instance.selectedShape != null) {
            await crs.call("interactive_map", "remove_layer_if_exists", {layer: instance.selectedShape, element: instance});
            instance.selectedShape = null;
            await crs.call("interactive_map", "set_mode", {element: instance, mode: "none"});
        }
    }

    static async remove_layer_if_exists(step, context, process, item) {
        const instance = await crs.dom.get_element(step, context, process, item);
        const map = instance.map;

        const target = await crs.process.getValue(step.args.target, context, process, item);
        let layer = await crs.process.getValue(step.args.layer, context, process, item);

        if (typeof layer === "string") {
            const layers = map._layers;
            layer = Object.values(layers).find(_ => _.layer_name === layer);
        }

        let result = false;

        if (layer != null) {
            if(layer._eventParents != null) {
                const keys = Object.keys(layer._eventParents);
                map.removeLayer(map._layers[keys[0]]);
            }
            map.removeLayer(layer);
            result = true;
        }

        if (target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    static async get_layer_geo_json(step, context, process, item) {
        const instance = await crs.dom.get_element(step, context, process, item);
        const layerName = await crs.process.getValue(step.args.layer, context, process, item);
        const target = await crs.process.getValue(step.args.target, context, process, item);
        const map = instance.map;
        const layers = map._layers;
        const layer = Object.values(layers).find(layer => layer.layer_name === layerName);

        const value = layer.toGeoJSON();

        if (target != null) {
            await crs.process.setValue(step.args.target, value, context, process, item);
        }

        return value;
    }
}

async function getModeProvider(mode) {
    const module = await import(`./providers/${mode}.js`);
    return new module.default();
}

async function getMap(step, context, process, item) {
    const instance = await crs.dom.get_element(step, context, process, item);
    return instance.nodeName === "INTERACTIVE-MAP" ? instance.map : instance;
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