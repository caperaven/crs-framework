import {CHANGE_TYPES} from "../../src/managers/data-manager/data-manager-types.js";
import {addDynamicPopup, createImageMap, createStandardMap, isValidCoordinates} from "./interactive-map-utils.js";
import {MAP_SELECTION_MODE} from "./interactive-map-selection-modes.js";
import "./../expanding-input/expanding-input.js";
import {ShapeFactory} from "./interactive-map-actions.js";

export class InteractiveMap extends HTMLElement {
    #map;
    #dataManagerChangedHandler = this.#dataManagerChanged.bind(this);
    #activeLayer
    #changeEventMap = {
        [CHANGE_TYPES.add]: this.#addRecord,
        [CHANGE_TYPES.update]: this.#updateRecord,
        [CHANGE_TYPES.delete]: this.#deleteRecord,
        [CHANGE_TYPES.refresh]: this.#refresh,
        [CHANGE_TYPES.selected]: this.#selectionChanged,
        [CHANGE_TYPES.filter]: this.#filterChanged
    };

    #coordinateInput;
    #coordinateSubmitHandler;
    #filterValue;
    #selectionProvider;


    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get map() {
        return this.#map;
    }

    get activeLayer() {
        return this.#activeLayer;
    }

    get maxShapes() {
        return this.dataset.maxShapes ?? 0;
    }

    constructor() {
        super();
    }

    async connectedCallback() {
        this.innerHTML = await fetch(this.html).then(result => result.text());
        await crsbinding.translations.add(globalThis.translations.interactiveMap, "interactiveMap");
    }

    async disconnectedCallback() {
        if (this.#coordinateInput != null) {
            this.#coordinateInput.removeEventListener("submit", this.#coordinateSubmitHandler);
            this.#coordinateInput = null;
            this.#coordinateSubmitHandler = null;
        }

        await crs.call("data_manager", "remove_change", {
            manager: this.dataset.manager,
            callback: this.#dataManagerChangedHandler
        });
        this.#dataManagerChangedHandler = null;
        this.#changeEventMap = null;
        // Dispose map mode if any
        if (this.currentMode != null) {
            await this.currentMode.dispose(this);
            this.currentMode = null;
        }

        this.#selectionProvider?.dispose();
        this.#selectionProvider = null;

        if (this.#map == null) return; // If map was never initialized, return

        await crs.call("dom_observer", "unobserve_resize", {element: this});

        // Remove all layers
        await crs.call("interactive_map", "clear_layers", {element: this});

        // Clean up
        this.#map.off();
        this.#map.remove();
        this.#map = null;
    }

    async initialize() {
        if (this.#map != null || this.dataset.loading != null) return;
        await crs.call("component", "notify_loading", {element: this});
        await crs.call("interactive_map", "initialize_lib", {});
        await this.#setSelectionMode();

        const container = this.querySelector("#map");

        const provider = this.dataset.provider;
        // Add a tile layer
        if (provider == null || provider === "openstreetmap") {
            this.#map = await createStandardMap(container);
        } else if (this.dataset.provider === "image") {
            this.#map = await createImageMap(container);
        }

        await this.#createDefaultLayer();

        await crs.call("interactive_map", "set_colors", {
            element: this,
            stroke_color: this.dataset.color,
            fill_color: this.dataset.fillColor,
            selection_color: this.dataset.selectionColor
        });

        await this.#hookDataManager();

        if (this.dataset.hideDrawingTools !== "true") {
            this.#addDrawingTools();
        }

        L.control.zoom({
            position: 'bottomleft'
        }).addTo(this.#map);


        await crs.call("dom_observer", "observe_resize", {
            element: this,
            callback: (value) => {
                this.#map.invalidateSize();
            }
        });

        await crs.call("component", "notify_ready", {element: this});
    }

    async #coordinateSubmit(event) {
        if (event.detail == null || event.detail === "") return;

        if (isValidCoordinates(event.detail)) {
            const parts = event.detail.split(",");
            const coordinates = [parseFloat(parts[0]), parseFloat(parts[1])];

            const shape = await crs.call("interactive_map", "add_shape", {
                element: this,
                layer: this.#activeLayer,
                data: {
                    coordinates: coordinates,
                    type: "point"
                }
            });

            await crs.call("interactive_map", "set_mode", {
                element: this,
                mode: "draw-point",
                shape: shape
            });

            await crs.call("interactive_map", "fit_bounds", {element: this, layer: this.#activeLayer});

        } else {
            await crsbinding.events.emitter.emit("toast", {
                message: await crsbinding.translations.get("interactiveMap.invalidCoordinates"),
                type: "error"
            });
        }
    }

    /**
     * @private
     * @method #hoodDataManager - get the data manager and set the event listeners to be notified of change
     */
    async #hookDataManager() {
        await crs.call("data_manager", "on_change", {
            manager: this.dataset.manager,
            callback: this.#dataManagerChangedHandler
        });
    }

    /**
     * setSelectionMode - Set the selection provider based on the selection mode
     * @returns {Promise<void>}
     */
    async #setSelectionMode() {
        const mode = MAP_SELECTION_MODE[this.dataset.selectionMode] || MAP_SELECTION_MODE.edit;
        const module = await import(`./providers/selection-${mode}.js`);
        this.#selectionProvider = new module.default();
        await this.#selectionProvider.initialize(this);
    }

    /**
     * @private
     * @method #dataManagerChanged - when the data manager changes, update the map
     * @returns {Promise<void>}
     */
    async #dataManagerChanged(args) {
        await this.#changeEventMap[args.action]?.call(this, args);
    }

    /**
     * @method #addRecord - add a record to the table where it was added in the data manager
     * @param args {Object} - arguments from the data manager change event
     * @returns {Promise<void>}
     */
    async #addRecord(args) {
        // Assign indexes to the records

        for (const item of args.models) {
            if (item.geographicLocation != null) {
                if (item.geographicLocation.type === "FeatureCollection") {
                    item.geographicLocation = item.geographicLocation.features[0]
                }
                item.geographicLocation.properties = item.geographicLocation.properties || {};
                item.geographicLocation.properties.id = item.id;
                item.geographicLocation.properties.index = item._index;
            } else {
                item.options = item.options || {};
                item.options.id = item.id;
                item.options.index = item._index;
            }
        }

        await crs.call("interactive_map", "add_records", {
            element: this,
            records: args.models,
            layer: this.#activeLayer
        });
    }

    /**
     * @method #updateRecord - update a record in the table where it was updated in the data manager
     * @param args {Object} - arguments from the data manager change event
     * @returns {Promise<void>}
     */
    async #updateRecord(args) {
        await crs.call("interactive_map", "redraw_record", {
            element: this,
            changes: args.changes,
            index: args.index,
            layer: this.#activeLayer
        });
    }

    /**
     * @method #deleteRecord - delete a record from the table where it was deleted in the data manager
     * @param args {Object} - arguments from the data manager change event
     * @returns {Promise<void>}
     */
    async #deleteRecord(args) {
        for (const index of args.indexes) {
            await crs.call("interactive_map", "remove_record", {
                element: this,
                index: index,
                layer: this.#activeLayer
            });
        }
    }

    async filterIndexes(indexes) {
        this.#filterValue = indexes;
        await this.#refresh();
    }

    async #filterChanged() {
        return this.#refresh();
    }

    async #refresh() {
        // If editing mode we want to dispose it when new data is coming in
        if (this.currentMode?.editing === true) {
           await crs.call("interactive_map", "cancel_mode", {element: this});
        }

        await crs.call("interactive_map", "clear_layer", {element: this, layer: this.#activeLayer});
        const data = await crs.call("data_manager", "get_filtered", {manager: this.dataset.manager});

        if (data?.length > 0) {
            // For now we are assuming geo data here. We will need to add support for other types of data in future

            for (const item of data) {

                if (item.geographicLocation != null) {
                    if (item.geographicLocation.type === "FeatureCollection") {
                        item.geographicLocation = item.geographicLocation.features[0]
                    }
                    item.geographicLocation.properties = item.geographicLocation.properties || {};
                    item.geographicLocation.properties.id = item.id;
                    item.geographicLocation.properties.index = item._index;
                }
            }

            await crs.call("interactive_map", "add_records", {
                element: this,
                records: data,
                layer: this.#activeLayer
            });

            await crs.call("interactive_map", "fit_bounds", {element: this, layer: this.#activeLayer});
        }
    }

    async #selectionChanged(args) {
        // We only support single selection
        this.#selectionProvider.select();
    }

    async enable() {
        if (this.#map == null) {
            await crs.call("interactive_map", "initialize", {element: this});
        }

        await crs.call("data_manager", "request_records", {manager: this.dataset.manager});
    }

    async #createDefaultLayer() {
        const defaultLayerOptions = {
            onEachFeature: async (feature, layer) => {
                const record = await crs.call("data_manager", "get", {manager: this.dataset.manager, index: feature.properties.index});
                const popupDefinition = feature.properties?.popupDefinition
                if (popupDefinition != null) {

                    layer.on('click', function (e) {
                        if (this.currentMode == null) {
                            addDynamicPopup(layer, popupDefinition, record);
                        }
                    });
                }
                layer.options.readonly = record.geographicLocation?.properties?.readonly
            },
            pointToLayer: (feature, latlng) => {
                const data = {
                    options: feature.properties?.style || {},
                    coordinates: [latlng.lat, latlng.lng]
                }
                return ShapeFactory.add_point(this.#map, data)
            },
            style: (feature) => {
                const style = feature.properties?.style || {};

                if (style.fillColor == null) {
                    style.fillColor = this.#map.fillColor;
                }

                if (style.color == null) {
                    style.color = this.#map.color;
                }

                return style;
            }
        }

        this.#activeLayer = L.geoJSON(null, defaultLayerOptions).addTo(this.#map);
    }

    async #addDrawingTools() {
        await crs.call("interactive_map", "show_drawing_tools", {element: this});

        this.#coordinateInput = document.createElement("expanding-input");
        this.#coordinateInput.dataset.placeholder = await crsbinding.translations.get("interactiveMap.enterCoordinates")
        this.#coordinateInput.dataset.icon = "add"
        this.querySelector("#search-tools").appendChild(this.#coordinateInput);
        this.#coordinateSubmitHandler = this.#coordinateSubmit.bind(this);
        this.#coordinateInput.addEventListener("submit", this.#coordinateSubmitHandler);
    }
}

customElements.define("interactive-map", InteractiveMap);