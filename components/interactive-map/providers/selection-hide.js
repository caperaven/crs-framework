export default class SelectionEditProvider {
    #instance;
    #shapeCache = [];

    async initialize(instance) {
        this.#instance = instance;
    }

    async dispose() {
        this.#instance = null;
    }

    async select(shape) {
        // Remove all shapes thats not the provided shape from the map and store them in the cache
        this.#instance.activeLayer.eachLayer(layer => {
            if (layer !== shape) {
                this.#shapeCache.push(layer);
                this.#instance.activeLayer.removeLayer(layer);
            }
        })

    }

    async clear() {
       // Show all the shapes again
        this.#shapeCache.forEach(layer => {
            this.#instance.activeLayer.addLayer(layer);
        });

        this.#shapeCache = [];
    }
}


