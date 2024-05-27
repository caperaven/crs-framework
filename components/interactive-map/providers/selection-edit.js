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

    async select(shape) {
       await this.clear();

        if(shape != null) {
            const provider = await this.#getProvider(shape);
            this.#selectionProvider = provider;
            this.#instance.selectedShape = shape;

            await provider.initialize(this.#instance, shape);
        }
    }

    async clear() {
        if (this.#selectionProvider != null) {
            this.#selectionProvider.dispose();
            this.#selectionProvider = null;
        }
    }

    async #getProvider(shape) {
        if (shape instanceof L.Layer) {
            const type = await this.#getType(shape);
            const module = await import(`./selection/select-${type}.js`);
            return new module.default();
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


