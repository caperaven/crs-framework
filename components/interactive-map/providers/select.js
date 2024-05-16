// This class is used to select existing shapes on the map
// It will then instantiate the relevant selection provider which will take over the selection process
// However if the shape selected changes, the selection provider will be disposed and a new one will be created

export default class SelectProvider {
    #instance;
    #selectionProvider;
    #shapeClickHandler;
    #clickHandler;
    #shapeSelected = false;

    constructor() {
        this.#selectionProvider = null;
    }

    async initialize(instance) {
        this.#instance = instance;
        await this.#setupEvents();
    }

    async dispose() {
        if (this.#instance.selectedShape != null) {
            this.#instance.selectedShape = null;
        }
        await this.#removeEvents();
        this.#instance = null;
        this.#selectionProvider?.dispose();
        this.#selectionProvider = null;
    }

    async #onShapeClick(e) {
        console.log("shape click")
        const shape = e.target;
        const element = e.originalEvent.target;

        if (shape != null) {
            this.#shapeSelected = true;
            if (this.#selectionProvider != null) {
                this.#selectionProvider.dispose();
            }

            const provider = await this.#getProvider(shape);
            this.#selectionProvider = provider;
            this.#instance.selectedShape = shape;

            await provider.initialize(this.#instance, shape, element);
        }
    }

    async #onMapClick(e) {
        if (this.#shapeSelected === false && this.#selectionProvider != null) {
            this.#selectionProvider.dispose();
            this.#selectionProvider = null;
            this.#instance.selectedShape = null;
        }
        this.#shapeSelected = false;
    }

    async #setupEvents() {
        this.#clickHandler = this.#onMapClick.bind(this);
        this.#shapeClickHandler = this.#onShapeClick.bind(this);

        this.#instance.map.on("click", this.#clickHandler);
        this.#instance.map.eachLayer(layer => {
            if (layer instanceof L.Path || layer instanceof L.Marker) {
                layer.on("click", this.#shapeClickHandler);
            }
        })
    }

    async #removeEvents() {
        this.#instance.map.off("click", this.#clickHandler);
        this.#instance.map.eachLayer(layer => {
            if (layer instanceof L.Path || layer instanceof L.Marker) {
                layer.off("click", this.#shapeClickHandler);
            }
        });

        this.#clickHandler = null;
        this.#shapeClickHandler = null;
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
