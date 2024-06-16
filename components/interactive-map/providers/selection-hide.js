import {getShapeIndex} from "../interactive-map-utils.js";

export default class SelectionEditProvider {
    #instance;
    #shapeCache = [];

    async initialize(instance) {
        this.#instance = instance;
    }

    async dispose() {
        this.#instance = null;
    }

    async select() {
       // Remove all layers and add to cache

        const indexes = await crs.call("data_manager", "get_selected_indexes", { manager: this.#instance.dataset.manager });
        if (indexes.length === 0) {
            // If no shapes are selected, show all shapes
            await this.clear();
            return crs.call("interactive_map", "fit_bounds", { element: this.#instance, layer: this.#instance.activeLayer });
        }

        this.#instance.activeLayer.eachLayer(layer => {
            this.#shapeCache.push(layer);
            this.#instance.activeLayer.removeLayer(layer);
        });

        // Show the selected shapes
        for (const index of indexes) {
            const shape = this.#shapeCache.find(shape => getShapeIndex(shape) === index);
            if (shape) {
                this.#instance.activeLayer.addLayer(shape);
            }
        }

        await crs.call("interactive_map", "fit_bounds", { element: this.#instance, layer: this.#instance.activeLayer });
    }

    async clear() {
       // Show all the shapes again
        this.#shapeCache.forEach(layer => {
            this.#instance.activeLayer.addLayer(layer);
        });

        this.#shapeCache = [];
    }
}


