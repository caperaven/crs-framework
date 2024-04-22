// This class is used to select existing shapes on the map
// It will then instantiate the relevant selection provider which will take over the selection process
// However if the shape selected changes, the selection provider will be disposed and a new one will be created

export default class SelectProvider {
    #instance;
    #selectionProvider;
    #clickHandler;

    constructor() {
        this.#selectionProvider = null;
    }

    async initialize(instance) {
        this.#instance = instance;
        await this.#setupEvents();
    }

    async dispose() {
        this.#instance = null;
        this.#selectionProvider?.dispose();
        this.#selectionProvider = null;
    }

    async onClick(e) {
        const shape = e.target;
        const element = e.originalEvent.target;

        if (shape != null) {
            if (this.#selectionProvider != null) {
                this.#selectionProvider.dispose();
            }

            const provider = await this.#getProvider(shape);
            this.#selectionProvider = provider;
            this.#instance.selectedShape = shape;
            await provider.initialize(this.#instance, shape, element);

        }
    }

    async #setupEvents() {
        this.#clickHandler = this.onClick.bind(this);
        this.#instance.map.eachLayer(layer => {
            if (layer instanceof L.Path || layer instanceof L.Marker) {
                layer.on("click", this.#clickHandler);
            }
        })
    }

    async #removeEvents() {
        this.#instance.map.eachLayer(layer => {
            if (layer instanceof L.Path || layer instanceof L.Marker) {
                layer.off("click", this.#clickHandler);
            }
        })
    }

    async #getProvider(shape) {
        if(shape instanceof L.Layer) {
            const type = await this.#getType(shape);
            const module = await import(`./selection/select-${type}.js`);
            return new module.default();
        }
    }

    async #getType(shape) {
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
