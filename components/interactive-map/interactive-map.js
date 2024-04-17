export class InteractiveMap extends HTMLElement {
    #map;

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get map() {
        return this.#map;
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch(this.html).then(result => result.text());
        await this.load();
    }

    async disconnectedCallback() {
        // Dispose map mode
        if (this.currentMode != null) {
            await this.currentMode.dispose(this);
            this.currentMode = null;
        }

        // Remove all layers
        this.#map.eachLayer(layer => {
            this.#map.removeLayer(layer);
        });

        // Clean up
        this.#map.off();
        this.#map.remove();
        this.#map = null;

    }

    async load() {
        return new Promise(resolve => {
            requestAnimationFrame(async () => {

                await crs.call("component", "notify_ready", {element: this});
                resolve();
            })
        })
    }

    async initialize() {
        const mapDiv = this.shadowRoot.querySelector("#map");

        // Add a tile layer
        if (this.dataset.provider === "openstreetmap") {
            // Initialize Leaflet map
            this.#map = L.map(mapDiv, {})
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
            }).addTo(this.#map);

            // Set the view to start with
            this.#map.setView([38.910, -77.034], 13);
        }

        if (this.dataset.provider === "image") {
            // Initialize Leaflet map
            this.#map = L.map(mapDiv, {
                crs: L.CRS.Simple,
                minZoom: -5
            })
            const bounds = [[0,0], [1406,2300]];
            L.imageOverlay(this.dataset.imageUrl, bounds).addTo(this.#map);
            this.#map.fitBounds(bounds);
        }

        // This is to remove the default zoom control and add a new one to the bottom right
        // this.#map.removeControl( this.#map.zoomControl);
        // L.control.zoom({ position: 'bottomright'}).addTo(this.#map);

        await crs.call("interactive_map", "set_colors", {element: this, stroke_color: this.dataset.strokeColor, fill_color: this.dataset.fillColor});
    }


}

customElements.define("interactive-map", InteractiveMap);