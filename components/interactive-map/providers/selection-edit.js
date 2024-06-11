export default class SelectionEditProvider {
    #selectionProvider;
    #instance;

    async initialize(instance) {
        this.#instance = instance;
    }

    async dispose() {
        this.#selectionProvider?.dispose();
        this.#selectionProvider = null;
    }

    async select() {
       await this.clear();

        const indexes = await crs.call("data_manager", "get_selected_indexes", { manager: this.#instance.dataset.manager });
        if (indexes.length === 0) {
            // If no shapes are selected, do nothing
            this.#instance.dispatchEvent(new CustomEvent("selection-changed", { detail: { index: null }}));
            return;
        }

        const firstIndex = indexes[0];

        const shape = await crs.call("interactive_map", "find_shape_by_index", { layer: this.#instance.activeLayer, index: firstIndex });

        if (shape != null) {
            const type = await this.#getType(shape);

            await crs.call("interactive_map", "set_mode", {
                element: this.#instance,
                mode: `draw-${type}`,
                shape: shape
            });
        }

        this.#instance.dispatchEvent(new CustomEvent("selection-changed", { detail: { index: firstIndex }}));
    }

    async clear() {
        if (this.#selectionProvider != null) {
            this.#selectionProvider.dispose();
            this.#selectionProvider = null;
        }
    }


    async #getType(shape) {
        // The order of the checks is important as a polygon is also a polyline and a rectangle is also a polygon
        if (shape instanceof L.Rectangle) {
            return "rectangle";
        } else if (shape instanceof L.Polygon) {
            return "polygon";
        } else if (shape instanceof L.Polyline) {
            return "polyline";
        } else if (shape instanceof L.Marker) {
            return "point";
        }
    }
}


