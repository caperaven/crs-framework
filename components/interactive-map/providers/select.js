// This class is used to select existing shapes on the map
// It will then instantiate the relevant selection provider which will take over the selection process
// However if the shape selected changes, the selection provider will be disposed and a new one will be created

import {getShapeIndex} from "../interactive-map-utils.js";

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

    async #onMapClick(e) {
        const shape = e.layer;

        shape.closePopup();

        if (shape.options?.readonly === true) return;

        const index =  getShapeIndex(shape);
        if (index != null) {
            await crs.call("data_manager", "set_selected", { manager: this.#instance.dataset.manager, indexes: [index] });
        }
    }

    async #setupEvents() {
        this.#clickHandler = this.#onMapClick.bind(this);
        this.#instance.activeLayer.on("click", this.#clickHandler);
    }

    async #removeEvents() {
        this.#instance.activeLayer.off("click", this.#clickHandler);
        this.#clickHandler = null;
    }
}
