// This class is used to select existing shapes on the map
// It will then instantiate the relevant selection provider which will take over the selection process
// However if the shape selected changes, the selection provider will be disposed and a new one will be created

export default class SelectProvider {
    #map;
    #selectionProvider;
    #clickHandler;

    constructor() {
        this.#selectionProvider = null;
    }

    async initialize(map) {
        this.#map = map;
        this.#clickHandler = this.onClick.bind(this)
        this.#map.on("click", this.#clickHandler);
    }

    async dispose() {
        this.#map.off("click", this.#clickHandler);
        this.#map = null;
        this.#selectionProvider?.dispose();
        this.#selectionProvider = null;
    }

    async onClick(e) {
        const shape = getShapeAt(this.#map, e.latlng);

        if (shape != null) {
            if (this.#selectionProvider != null) {
                this.#selectionProvider.dispose();
            }

            const provider = await this.getProvider(shape);
            this.#selectionProvider = provider;
            await provider.initialize(this.#map, shape);
        }
    }

    async getProvider(shape) {
        const type = shape.type;
        const module = await import(`./selection/select-${type}.js`);
        return new module.default();
    }
}

function getShapeAt(map, latlng) {
    const layers = Object.values(map._layers);
    const point = map.latLngToLayerPoint(latlng);

    for (const layer of layers) {
        // Check if layer is a shape layer
        if (layer instanceof L.Path) {
            // For polygons and polylines
            if (layer.getBounds && layer.getBounds().contains(latlng)) {
                return layer;
            }
            // For circles
            else if (layer instanceof L.Circle && layer.getLatLng().distanceTo(latlng) <= layer.getRadius()) {
                return layer;
            }
        }
        // For rectangles
        else if (layer instanceof L.Rectangle && layer.getBounds().contains(latlng)) {
            return layer;
        }
    }

    return null; // No shape found at given point
}