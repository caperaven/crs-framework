import {COLORS} from "./interactive-map-colors.js";

export class InteractiveMapActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    static async initialize_lib() {
        return new Promise(resolve => {
            if (globalThis.L == null) {
                requestAnimationFrame(async () => {
                    const leafletScript = document.createElement('script');
                    const baseUrl = window.location.origin + window.location.pathname.split('/').slice(0, -1).join('/');
                    leafletScript.src = `${baseUrl}/packages/leaflet/leaflet.js`;
                    leafletScript.onload = async () => {
                        resolve();
                    }

                    const leafletCss = document.createElement('link');
                    leafletCss.rel = 'stylesheet';
                    leafletCss.href = `${baseUrl}/packages/leaflet/leaflet.css`;
                    document.head.appendChild(leafletCss);
                    document.body.appendChild(leafletScript);

                });
            } else {
                resolve();
            }
        });
    }

    static async initialize(step, context, process, item) {
        const instance = await crs.dom.get_element(step, context, process, item);
        const defaultLayer = await crs.process.getValue(step.args.default_layer || "default", context, process, item);
        await instance.initialize();
        instance.defaultLayer = defaultLayer;
    }

    static async set_colors(step, context, process, item) {
        const map = await getMap(step, context, process, item);
        const color = await crs.process.getValue(step.args.color || "#E00000", context, process, item);
        const fillColor = await crs.process.getValue(step.args.fill_color || "#E000004D", context, process, item);
        const selectionColor = await crs.process.getValue(step.args.selection_color || "#0276C2", context, process, item);

        map.color = color;
        map.fillColor = fillColor;
        map.selectionColor = selectionColor;

        if (map.selectedShape != null) {
            map.selectedShape.setStyle({fillColor: fillColor});
            map.selectedShape.setStyle({color: color});
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

    static async cancel_poly(step, context, process, item) {
        const instance = await crs.dom.get_element(step, context, process, item);

        if (instance.currentMode != null) {
            await instance.currentMode.cancel();
            await crs.call("interactive_map", "set_mode", {element: instance, mode: "none"});
        }
    }

    static async accept_poly(step, context, process, item) {
        const instance = await crs.dom.get_element(step, context, process, item);

        if (instance.currentMode != null) {
            await instance.currentMode.accept();
            await crs.call("interactive_map", "set_mode", {element: instance, mode: "none"});
        }
    }

    static async fit_bounds(step, context, process, item) {
        const instance = await crs.dom.get_element(step, context, process, item);
        const layer = await crs.process.getValue(step.args.layer, context, process, item);
        const padding = await crs.process.getValue(step.args.padding || [30, 30], context, process, item);
        const map = instance.map;

        if (padding != null) {
            map.fitBounds(layer.getBounds(), { padding: padding });
        }
    }

    static async add_geo_json(step, context, process, item) {
        const data = await crs.process.getValue(step.args.data, context, process, item);
        const layer = await crs.process.getValue(step.args.layer, context, process, item);
        const geoJson = layer.addData(data);
        return geoJson;
    }

    static async add_point(step, context, process, item) {
        const instance = await crs.dom.get_element(step, context, process, item);
        const map = instance.map;
        const coordinates = await crs.process.getValue(step.args.coordinates, context, process, item);
        const iconName = await crs.process.getValue(step.args.icon_name || "location-pin", context, process, item);
        const options = await crs.process.getValue(step.args.options || {}, context, process, item);
        const layerName = await crs.process.getValue(step.args.layer || instance.defaultLayer, context, process, item);

        const marker = createDefaultPoint(iconName, coordinates, options).addTo(map);
        marker.type = "point";
        marker.layer_name = layerName;

        return marker;
    }

    static async add_polygon(step, context, process, item) {
        step.args.shape = "polygon";
        return this.add_polyline(step, context, process, item);
    }

    static async add_polyline(step, context, process, item) {
        const instance = await crs.dom.get_element(step, context, process, item);
        const map = instance.map;
        const shape = await crs.process.getValue(step.args.shape || "polyline", context, process, item);
        const coordinates = await crs.process.getValue(step.args.coordinates, context, process, item);
        const dashArray = await crs.process.getValue(step.args.dash_array, context, process, item);
        const colors = await getColorData(step, context, process, item, map);

        const options = {...colors};

        if (dashArray != null) {
            options.dashArray = dashArray;
        }

        const polygon = L[shape](coordinates, options).addTo(instance.activeLayer);
        polygon.type = shape;
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
        marker.type = type;
        return marker;
    }

    static async show_drawing_tools(step, context, process, item) {
        const instance = await crs.dom.get_element(step, context, process, item);

        await import("./interactive-map-draw-toolbar/interactive-map-draw-toolbar.js");

        const toolbar = document.createElement("interactive-map-draw-toolbar");

        instance.querySelector("#drawing-tools").appendChild(toolbar);

        await toolbar.setInstance(instance);
    }

    static async clear_layers(step, context, process, item) {
        const instance = await crs.dom.get_element(step, context, process, item);
        const map = instance.map;

        if (map == null) return;

        map.eachLayer(layer => {
            map.removeLayer(layer);
        });
    }

    static async clear_layer(step, context, process, item) {
        const instance = await crs.dom.get_element(step, context, process, item);
        const map = instance.map;
        const layer = await crs.process.getValue(step.args.layer, context, process, item);

        if (map == null) return;

        layer.eachLayer(child => {
            layer.removeLayer(child);
        });
    }


    static async remove_selected(step, context, process, item) {
        const instance = await crs.dom.get_element(step, context, process, item);

        if (instance.selectedShape != null) {
            await crs.call("interactive_map", "remove_layer_if_exists", {
                layer: instance.selectedShape,
                element: instance
            });
            instance.selectedShape = null;
            await crs.call("interactive_map", "set_mode", {element: instance, mode: "none"});
        }
    }

    static async remove_layer_if_exists(step, context, process, item) {
        const instance = await crs.dom.get_element(step, context, process, item);
        const map = instance.map;

        if (map == null) return false;

        const target = await crs.process.getValue(step.args.target, context, process, item);
        let layer = await crs.process.getValue(step.args.layer, context, process, item);

        if (typeof layer === "string") {
            const layers = map._layers;
            layer = Object.values(layers).find(_ => _.layer_name === layer);
        }

        let result = false;

        if (layer != null) {
            if (layer._eventParents != null) {
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

    static async convert_geo_json_to_array(step, context, process, item) {
        const geoJson = await crs.process.getValue(step.args.geo_json, context, process, item);
        const target = await crs.process.getValue(step.args.target, context, process, item);

        const value = geoJson.features.map(feature => {
            return feature.geometry.coordinates;
        });

        if (target != null) {
            await crs.process.setValue(step.args.target, value, context, process, item);
        }

        return value;
    }

    static async assign_colors_to_geo_data(step, context, process, item) {
        const data = await crs.process.getValue(step.args.data ?? [], context, process, item);
        const featurePath = await crs.process.getValue(step.args.feature_path || "geographicLocation", context, process, item);

        if (data.length === 0) return data;
        const colorsLength = Object.keys(COLORS).length;
        let index = 0;
        data.forEach((item) => {
            let source;
            if(item[featurePath].type === "FeatureCollection") {
                // If it comes from server as feature collection we need to get the first feature. The server does not support multiple features in a collection
                source = item[featurePath].features[0];
            }
            else {
                source = item[featurePath];
            }

            source.properties = item[featurePath].properties ?? {};
            source.properties.fillColor = COLORS[index].fillColor || COLORS[index].fillColor;
            source.properties.color = COLORS[index].color;

            index ++;

            if(index >= colorsLength) {
                index = 0;
            }
        });
        return data;
    }

    static async assign_properties_to_geo_data(step, context, process, item) {
        const data = await crs.process.getValue(step.args.data ?? [], context, process, item);
        const featurePath = await crs.process.getValue(step.args.feature_path || "geographicLocation", context, process, item);
        const properties = await crs.process.getValue(step.args.properties, context, process, item);

        const keys = Object.keys(properties);
        let values = {};

        for (const key of keys) {
            values[key] = await crs.process.getValue(properties[key], context, process, item);
        }

        data.forEach((item) => {
            let source;
            if(item[featurePath].type === "FeatureCollection") {
                // If it comes from server as feature collection we need to get the first feature. The server does not support multiple features in a collection
                source = item[featurePath].features[0];
            }
            else {
                source = item[featurePath];
            }

            source.properties = item[featurePath].properties ?? {};

            for (const key of keys) {
                source.properties[key] = values[key];
            }
        });
        return data;
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
    const color = await crs.process.getValue(step.args.color, context, process, item);
    const weight = await crs.process.getValue(step.args.weight, context, process, item);

    return {
        fillColor: fillColor || map.fillColor,
        color: color || map.color,
        weight: weight || 2
    }
}

function createDefaultPoint(iconName, coordinates, options = {}) {
    const customIcon = L.divIcon({
        className: 'marker',
        html: `<div class="point">${iconName}</div>`,
        iconSize: [32, 32], // Size of the icon
        iconAnchor: [16, 32] // Point of the icon which will correspond to marker's location
    });
    const marker = L.marker(coordinates, {icon: customIcon, ...options});
    return marker;
}


crs.intent.interactive_map = InteractiveMapActions;