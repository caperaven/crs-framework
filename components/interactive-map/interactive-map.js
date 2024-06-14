import {CHANGE_TYPES} from "../../src/managers/data-manager/data-manager-types.js";
import {createImageMap, createStandardMap, isValidCoordinates} from "./interactive-map-utils.js";
import {MAP_SELECTION_MODE} from "./interactive-map-selection-modes.js";
import "./../expanding-input/expanding-input.js";

export class InteractiveMap extends HTMLElement {
    #map;
    #layerLookupTable = {};
    #dataManagerChangedHandler = this.#dataManagerChanged.bind(this);
    #activeLayer
    #changeEventMap = {
        [CHANGE_TYPES.add]: this.#addRecord,
        [CHANGE_TYPES.update]: this.#updateRecord,
        [CHANGE_TYPES.delete]: this.#deleteRecord,
        [CHANGE_TYPES.filter]: this.#filterRecords,
        [CHANGE_TYPES.refresh]: this.#refresh,
        [CHANGE_TYPES.selected]: this.#selectionChanged
    };

    #coordinateInput;
    #coordinateSubmitHandler;
    #maxShapes;
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
        return this.#maxShapes || 0;
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

        this.#selectionProvider.dispose();
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

    async initialize(maxShapes = null) {
        if (this.#map != null || this.dataset.loading != null) return;
        await crs.call("component", "notify_loading", {element: this});
        await crs.call("interactive_map", "initialize_lib", {});
        await this.#setSelectionMode();
        this.#maxShapes = maxShapes;

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
            await crs.call("interactive_map", "show_drawing_tools", {element: this});
        }

        if (this.dataset.hideSearchTools !== "true") {
            this.#coordinateInput = document.createElement("expanding-input");
            this.#coordinateInput.dataset.placeholder = await crsbinding.translations.get("interactiveMap.enterCoordinates")
            this.#coordinateInput.dataset.icon = "add"
            this.querySelector("#search-tools").appendChild(this.#coordinateInput);
            this.#coordinateSubmitHandler = this.#coordinateSubmit.bind(this);
            this.#coordinateInput.addEventListener("submit", this.#coordinateSubmitHandler);
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
            
        }
        else {
            await crsbinding.events.emitter.emit("toast", {message: await crsbinding.translations.get("interactiveMap.invalidCoordinates"), type: "error"});
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

        await crs.call("interactive_map", "add_records", {
            element: this,
            records: args.models,
            index: args.index,
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
        await crs.call("interactive_map", "remove_record", {
            element: this,
            index: args.index,
            layer: this.#activeLayer
        });
    }

    /**
     * @method #filterRecords - the data manager performed a filter operation and these are the records you need to show
     * @param args {Object} - arguments from the data manager change event
     * @returns {Promise<void>}
     */
    async #filterRecords(args) {
    }


    async #refresh(args) {
        await crs.call("interactive_map", "clear_layer", {element: this, layer: this.#activeLayer});
        let data = await crs.call("data_manager", "get_all", {manager: this.dataset.manager});

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
            pointToLayer: (feature, latlng) => {

                return createDefaultPoint( feature,[latlng.lat, latlng.lng], {});
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
}

function createDefaultPoint(feature, coordinates, options = {}) {
    const iconName = feature.properties?.icon || "location-pin";
    const color = feature.properties?.color || "red";

    const style = `style="color: ${color};"`
    const html = `<div class="point" ${style}>${iconName}</div>`;
    const customIcon = L.divIcon({
        className: 'marker',
        html: html,
        iconSize: [32, 32], // Size of the icon
        iconAnchor: [16, 32] // Point of the icon which will correspond to marker's location
    });
    const marker = L.marker(coordinates, {icon: customIcon, ...options});
    return marker;
}

customElements.define("interactive-map", InteractiveMap);