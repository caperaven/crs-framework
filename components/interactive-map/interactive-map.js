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
        // Clean up
        this.#map.remove();
        this.#map = null;

    }

    async load() {
        return new Promise(resolve => {
            requestAnimationFrame(async () => {
                // Dynamically load Leaflet script
                const leafletScript = document.createElement('script');
                leafletScript.src = "/packages/leaflet/leaflet.js";
                leafletScript.onload = async () => {
                    // Once script is loaded, initialize Leaflet
                    this.initLeaflet();
                    await crs.call("component", "notify_ready", { element: this });
                    resolve();
                };
                this.shadowRoot.appendChild(leafletScript);
            })
        })
    }

    initLeaflet() {
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
    }

    addToMap(geoJson, drawingOptions) {
        // Create a GeoJSON layer and add it to the map
        L.geoJSON(geoJson, drawingOptions).addTo(this.#map);
    }

    addPoint(geoJson) {

        // Define the custom marker icon using a <div> element
        const customIcon = L.divIcon({
            className: 'marker',
            html: "<div class='icon'>radio-button-unchecked</div>",
            iconSize: [32, 32], // Size of the icon
            iconAnchor: [16, 16] // Point of the icon which will correspond to marker's location
        });

        // Add a marker to the map
        L.geoJSON(geoJson, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {icon: customIcon, draggable: true});
            }
        }).addTo(this.#map);
    }
}

customElements.define("interactive-map", InteractiveMap);