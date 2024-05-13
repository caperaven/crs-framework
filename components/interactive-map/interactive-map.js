import {CHANGE_TYPES} from "../../src/managers/data-manager/data-manager-types.js";

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
        this.attachShadow({mode: "open"});
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch(this.html).then(result => result.text());
    }



    async disconnectedCallback() {
        // Dispose map mode
        if (this.currentMode != null) {
            await this.currentMode.dispose(this);
            this.currentMode = null;
        }

        if (this.#map == null) return; // If map was never initialized, return

        // Remove all layers
        await crs.call("interactive_map", "clear_layers", { element: this});

        // Clean up
        this.#map.off();
        this.#map.remove();
        this.#map = null;
    }

    async initialize() {
        if (this.#map != null || this.dataset.loading != null) return;
        console.log("Initializing map");
        await crs.call("component", "notify_loading", {element: this});

        await crs.call("interactive_map", "initialize_lib", {});

        const mapDiv = this.shadowRoot.querySelector("#map");

        const provider = this.dataset.provider;
        // Add a tile layer
        if (provider == null || provider === "openstreetmap") {
            // Initialize Leaflet map
            this.#map = L.map(mapDiv, { preferCanvas: true});
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
            }).addTo(this.#map);

            // Set the view to start with
            this.#map.setView([-33.926382242852945, 18.42038154602051], 13);
        }

        if (this.dataset.provider === "image") {
            // Initialize Leaflet map
            this.#map = L.map(mapDiv, {
                crs: L.CRS.Simple,
                minZoom: -5
            })
            const bounds = [[0, 0], [1406, 2300]];
            L.imageOverlay(this.dataset.imageUrl, bounds).addTo(this.#map);
            this.#map.fitBounds(bounds);
        }

        // This is to remove the default zoom control and add a new one to the bottom right
        // this.#map.removeControl( this.#map.zoomControl);
        // L.control.zoom({ position: 'bottomright'}).addTo(this.#map);

        await crs.call("interactive_map", "set_colors", {
            element: this,
            stroke_color: this.dataset.strokeColor,
            fill_color: this.dataset.fillColor
        });

        await this.#hookDataManager();

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
        await crs.call("interactive_map", "clear_layers", { element: this});
        const data = await crs.call("data_manager", "get_all", { manager: this.dataset.manager });

        if (data?.length > 0) {
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