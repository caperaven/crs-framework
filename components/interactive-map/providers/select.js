// This class is used to select existing shapes on the map
// It will then instantiate the relevant selection provider which will take over the selection process
// However if the shape selected changes, the selection provider will be disposed and a new one will be created

export default class SelectProvider {
    #instance;

    #shapeClickHandler;
    #clickHandler;
    #shapeSelected = false;


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
    }

    async #onShapeClick(e) {
        const shape = e.target;

        const index =  shape.options.index ?? shape.feature.properties?.index;
        if (index != null) {
            this.#shapeSelected = true;
            await crs.call("data_manager", "set_selected", { manager: this.#instance.dataset.manager, indexes: [index] });
        }
    }

    async #onMapClick(e) {
        if (this.#shapeSelected === false) {
            this.#instance.selectedShape = null;
            await crs.call("data_manager", "set_selected", { manager: this.#instance.dataset.manager, indexes: [] });
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
}
