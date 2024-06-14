import {COLORS} from "./interactive-map-colors.js";
import {getShapeIndex} from "./interactive-map-utils.js";

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
        const maxShapes = await crs.process.getValue(step.args.max_shapes, context, process, item);
        await instance.initialize(maxShapes)
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

        const mode = await crs.process.getValue(step.args.mode ?? "none", context, process, item);
        const shape = await crs.process.getValue(step.args.shape, context, process, item);

        if (instance.currentMode != null) {
            instance.currentMode.dispose(instance);
            instance.currentMode = null;
        }

        if (mode !== "none") {
            const modeClass = await getModeProvider(mode);
            instance.currentMode = await modeClass;
            await modeClass.initialize(instance, shape);
        }

        instance.dispatchEvent(new CustomEvent("mode-changed", {detail: {mode: mode}}));
    }

    static async cancel_mode(step, context, process, item) {
        const instance = await crs.dom.get_element(step, context, process, item);

        if (instance.currentMode != null) {
            await instance.currentMode.cancel();
            await crs.call("interactive_map", "set_mode", {element: instance, mode: "none"});
        }
    }

    static async accept_mode(step, context, process, item) {
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

    static async find_shape_by_index(step, context, process, item) {
        const layer = await crs.process.getValue(step.args.layer, context, process, item);
        const index = await crs.process.getValue(step.args.index, context, process, item);

        return  layer.getLayers().find(shape => {

            const currentShapeIndex = getShapeIndex(shape);

            // Compare with the provided index
            return index === currentShapeIndex;
        });
    }

    static async add_records(step, context, process, item) {
        const records = await crs.process.getValue(step.args.records, context, process, item);
        const layer = await crs.process.getValue(step.args.layer, context, process, item);
        const instance = await crs.dom.get_element(step, context, process, item);
        const index = await crs.process.getValue(step.args.index ?? 0, context, process, item);

        for (let i = 0; i < records.length; i++) {

            const record = records[i];
            if (record.geographicLocation != null)  {
                record.geographicLocation.properties = record.geographicLocation.properties || {};
                record.geographicLocation.properties.index = index + i;
                // Add shape via geojson
                layer.addData(record.geographicLocation);
            }
            else {
                record.options = record.options || {};
                record.options.index = index + i;
                await ShapeFactory[`add_${record.type}`](instance.map, layer, record);
            }
        }
    }

    static async redraw_record(step, context, process, item) {
        const instance = await crs.dom.get_element(step, context, process, item);
        const layer = await crs.process.getValue(step.args.layer, context, process, item);
        const index = await crs.process.getValue(step.args.index, context, process, item);

        const shape = await crs.call("interactive_map", "find_shape_by_index", {layer: layer, index: index});
        const record = await crs.call("data_manager", "get", {manager: instance.dataset.manager, index: index});

        // For now we remove shape and add it again
        if (shape != null) {
            layer.removeLayer(shape);

            await crs.call("interactive_map", "add_records", {
                element: instance,
                records: [record],
                layer: layer,
                index: index
            });
        }
    }

    static async remove_record(step, context, process, item) {
        const layer = await crs.process.getValue(step.args.layer, context, process, item);
        const index = await crs.process.getValue(step.args.index, context, process, item);

        const shape = await crs.call("interactive_map", "find_shape_by_index", {layer: layer, index: index});
        layer.removeLayer(shape);
    }

    static async add_shape(step, context, process, item) {
        const instance = await crs.dom.get_element(step, context, process, item);
        const map = instance.map;
        const layer = await crs.process.getValue(step.args.layer, context, process, item);
        const data = await crs.process.getValue(step.args.data, context, process, item);

        const shape = await ShapeFactory[`add_${data.type}`](map, layer, data);
        return shape;
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
        return toolbar;
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

            source.properties = source.properties ?? {};
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

            source.properties = source.properties ?? {};

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




crs.intent.interactive_map = InteractiveMapActions;


class ShapeFactory {
    static async add_polygon(map, layer, data) {
        return L.polygon(data.coordinates, data.options).addTo(layer);
    }

    static async add_polyline(map, layer, data) {
        return L.polyline(data.coordinates, data.options).addTo(layer);
    }

    static async add_point(map, layer, data) {

        const iconName = data.options?.iconName ?? "location-pin";
        const color = data.options?.color ?? "#E00000";

        const customIcon = L.divIcon({
            className: 'marker',
            html: `<div class="point">${iconName}</div>`,
            iconSize: [48, 48], // Size of the icon
            iconAnchor: [24, 48] // Point of the icon which will correspond to marker's location
        });

        const marker = L.marker(data.coordinates, {icon: customIcon, ...data.options}).addTo(layer);

        const icon = marker.getElement().firstChild;
        icon.style.color = color;
        return marker;
    }
}