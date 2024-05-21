import {CHANGE_TYPES} from "../../src/managers/data-manager/data-manager-types.js";
import {createImageMap, createStandardMap} from "./interactive-map-utils.js";

export class InteractiveMap extends HTMLElement {
    #map;
    #dataManagerChangedHandler = this.#dataManagerChanged.bind(this);
    #changeEventMap = {
        [CHANGE_TYPES.add]: this.#addRecord,
        [CHANGE_TYPES.update]: this.#updateRecord,
        [CHANGE_TYPES.delete]: this.#deleteRecord,
        [CHANGE_TYPES.filter]: this.#filterRecords,
        [CHANGE_TYPES.refresh]: this.#refresh,
    };

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get map() {
        return this.#map;
    }

    constructor() {
        super();
    }

    async connectedCallback() {
        this.innerHTML = await fetch(this.html).then(result => result.text());
    }

    async disconnectedCallback() {
        await crs.call("data_manager", "remove_change", {manager: this.dataset.manager, callback: this.#dataManagerChangedHandler});
        this.#dataManagerChangedHandler = null;
        this.#changeEventMap = null;
        // Dispose map mode if any
        if (this.currentMode != null) {
            await this.currentMode.dispose(this);
            this.currentMode = null;
        }

        if (this.#map == null) return; // If map was never initialized, return

        await crs.call("dom_observer", "unobserve_resize", {element: this});

        // Remove all layers
        await crs.call("interactive_map", "clear_layers", { element: this});

        // Clean up
        this.#map.off();
        this.#map.remove();
        this.#map = null;
    }

    async initialize() {
        if (this.#map != null || this.dataset.loading != null) return;
        await crs.call("component", "notify_loading", {element: this});
        await crs.call("interactive_map", "initialize_lib", {});

        const container = this.querySelector("#map");

        const provider = this.dataset.provider;
        // Add a tile layer
        if (provider == null || provider === "openstreetmap") {
           this.#map = await createStandardMap(container);
        } else if (this.dataset.provider === "image") {
            this.#map = await createImageMap(container);
        }

        await crs.call("interactive_map", "set_colors", {
            element: this,
            stroke_color: this.dataset.color,
            fill_color: this.dataset.fillColor,
            selection_color: this.dataset.selectionColor
        });

        await this.#hookDataManager();

        await crs.call("dom_observer", "observe_resize", {
            element: this,
            callback: (value)=> {
                this.#map.invalidateSize();
            }
        })

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
     * @private
     * @method #dataManagerChanged - when the data manager changes, update the map
     * @returns {Promise<void>}
     */
    async #dataManagerChanged(args) {
        await this.#changeEventMap[args.action].call(this, args);
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
        await crs.call("interactive_map", "clear_layers", {element: this});
        let data = await crs.call("data_manager", "get_all", {manager: this.dataset.manager});

        if (data?.length > 0) {
            // For now we are assuming geo data here. We will need to add support for other types of data in future
            if(this.dataset.geoDataPath != null) {
                data = data.map(record => {
                    return record[this.dataset.geoDataPath];
                });
            }

            await crs.call("interactive_map", "add_geo_json", {
                element: this,
                layer: "default",
                data: data
            });
        }
    }


    async enable() {
        if (this.#map == null) {
            await this.initialize();
        }

        await crs.call("data_manager", "request_records", {manager: this.dataset.manager});
    }
}

customElements.define("interactive-map", InteractiveMap);