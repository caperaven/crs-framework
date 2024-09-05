import {getShapeIndex, notifyCoordinatesChanged} from "../interactive-map-utils.js";
import {accept_shape} from "./draw/draw-helpers.js";

export default class DrawPoint {

    #instance = null;
    #clickHandler = this.#click.bind(this);
    #point = null;
    #isEditing = false;

    async initialize(instance, point, options = {}) {
        this.#instance = instance;
        this.#instance.map.on("click", this.#clickHandler);

        if (point != null) {
            this.#point = point;
            // We pass in options.isEditing because when adding a marker from drawing tools externally we want to assume its a new point
            // e.g. coordinateInput
            this.#isEditing =  options.isEditing ?? true;
            await this.#setMarkerColor(this.#instance.map.selectionColor);
            notifyCoordinatesChanged(this.#instance, this.#point);
        }
    }

    async dispose() {
        this.#instance.map.off("click", this.#clickHandler);
        this.#instance = null;

        this.#point = null;
    }

    async #click(event) {
        if (this.#point != null) {
            this.#point.setLatLng(event.latlng);
        }
        else {
            await this.#addNewMarker(event.latlng);
        }

        notifyCoordinatesChanged(this.#instance, this.#point);
    }

    async #addNewMarker(latlng) {
        this.#point = await crs.call("interactive_map", "add_shape", {
            layer: this.#instance.activeLayer,
            data: {
                type: "point",
                coordinates: [latlng.lat, latlng.lng],
                options: {
                    color: this.#instance.map.selectionColor,
                    draggable: true
                }
            },
            element: this.#instance
        });
    }

    async #setMarkerColor(color){
        const element = this.#point.getElement();
        const icon = element.querySelector(".point");
        icon.style.color = color;
    }

    async cancel() {
        if (this.#point != null) {

            const index = getShapeIndex(this.#point);

            if (index != null) {
                // Only existing shapes will have an index
                await crs.call("data_manager", "set_selected", {
                    manager: this.#instance.dataset.manager,
                    indexes: [index],
                    selected: false
                });

                // Remove temp shape and also redraw the original shape if editing was true

                await crs.call("interactive_map", "redraw_record", {
                    element: this.#instance,
                    index: index,
                    layer: this.#instance.activeLayer
                });
            }
            this.#point.remove();
            this.#point = null;
        }
        notifyCoordinatesChanged(this.#instance)
    }

    async accept() {
        this.#point = await accept_shape(this.#instance, "point", this.#point, this.#isEditing);
    }
}

function latLngToCoordinates(point) {
    const latlng = point.getLatLng();
    return [latlng.lat, latlng.lng];
}

