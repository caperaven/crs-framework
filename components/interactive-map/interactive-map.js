import {CHANGE_TYPES} from "../../src/managers/data-manager/data-manager-types.js";
import {createImageMap, createStandardMap} from "./interactive-map-utils.js";
import {MAP_SELECTION_MODE} from "./interactive-map-selection-modes.js";

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

    constructor() {
        super();
    }

    async connectedCallback() {
        this.innerHTML = await fetch(this.html).then(result => result.text());
    }

    async disconnectedCallback() {
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

        if (this.dataset.hidesDrawingTools !== true) {
            await crs.call("interactive_map", "show_drawing_tools", {element: this});
        }

        await crs.call("dom_observer", "observe_resize", {
            element: this,
            callback: (value) => {
                this.#map.invalidateSize();
            }
        });

        await crs.call("component", "notify_ready", {element: this});
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
    }

    /**
     * @method #updateRecord - update a record in the table where it was updated in the data manager
     * @param args {Object} - arguments from the data manager change event
     * @returns {Promise<void>}
     */
    async #updateRecord(args) {
    }

    /**
     * @method #deleteRecord - delete a record from the table where it was deleted in the data manager
     * @param args {Object} - arguments from the data manager change event
     * @returns {Promise<void>}
     */
    async #deleteRecord(args) {
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
                const geoData = item[this.dataset.path];
                geoData.properties = geoData.properties || {};
                geoData.properties.id = item.id;
                geoData.properties.index = item._index;
                await crs.call("interactive_map", "add_geo_json", {
                    element: this,
                    data: geoData,
                    layer: this.#activeLayer,
                });
            }


            await crs.call("interactive_map", "fit_bounds", {element: this, layer: this.#activeLayer});
        }
    }

    async #selectionChanged(args) {
        // We only support single selection
        if (args.index?.length > 0) {
            this.#activeLayer.eachLayer(layer => {
                // If the layer is a feature layer, we need to use the index from the feature properties
                const index = layer.options.index || layer.feature.properties.index
                if (index === args.index[0]) {
                    this.#selectionProvider.select(layer);
                }
            });
        }
        else {
            this.#selectionProvider.clear();
        }
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
                return createDefaultPoint("location-pin", [latlng.lat, latlng.lng], {});
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

customElements.define("interactive-map", InteractiveMap);