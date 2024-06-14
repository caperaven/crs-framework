import {getShapeIndex} from "../interactive-map-utils.js";

export default class DrawPoint {

    #instance = null;
    #clickHandler = this.#click.bind(this);
    #point = null;

    async initialize(instance, point) {
        this.#instance = instance;
        this.#instance.map.on("click", this.#clickHandler);

        if (point != null) {
            this.#point = point;
        }
    }

    async dispose() {
        this.#instance.map.off("click", this.#clickHandler);
        this.#instance = null;

        this.#point = null;
    }

    async #click(event) {
        if(this.#point != null) {
           this.#point.remove();
        }

        this.#point = await crs.call("interactive_map", "add_shape", {
            layer: this.#instance.activeLayer,
            data: {
                type: "point",
                coordinates: [event.latlng.lat, event.latlng.lng],
                options: {
                    color: this.#instance.map.selectionColor,
                    draggable: true
                }
            },
            element: this.#instance
        });
    }

    async cancel() {
        if (this.#point != null) {

            const index = getShapeIndex(this.#point);

            if (index != null) {
                // Only existing shapes will have an index
                await crs.call("data_manager", "set_selected", {manager: this.#instance.dataset.manager, indexes: [index], selected: false});

                // Remove temp shape and also redraw the original shape if editing was true

                await crs.call("interactive_map", "redraw_record", {
                    element: this.#instance,
                    index: index,
                    layer: this.#instance.activeLayer
                });
            }
        }

        this.#point.remove();
        this.#point = null;
    }

    async accept() {
        if (this.#point != null) {
            const index = getShapeIndex(this.#point);
            if (index != null) {
                const index = getShapeIndex(this.#point);

                let changes = {}
                // Get the changes from either shape options or feature properties
                if (this.#point.feature) {
                    changes.geographicLocation = this.#point.toGeoJSON()
                }
                else {
                    changes.coordinates = latLngToCoordinates(this.#point)
                }

                await crs.call("data_manager", "update", {
                    index: index,
                    manager: this.#instance.dataset.manager,
                    changes: changes,
                    is_dirty: true
                });

                await crs.call("data_manager", "set_selected", {manager: this.#instance.dataset.manager, indexes: [index], selected: false});
            }
            else {

                let record;
                if ( this.#instance.dataset.format === "geojson") {
                    record = {
                        geographicLocation: this.#point.toGeoJSON()
                    }
                }
                else {
                    record =  {
                        coordinates: latLngToCoordinates(this.#point),
                        type: "point"
                    }
                }

                await crs.call("data_manager", "append", {
                    records: [record],
                    manager: this.#instance.dataset.manager,
                    is_dirty: true
                });
            }

            this.#point.remove();
            this.#point = null;
        }
    }
}

function latLngToCoordinates(point) {
    const latlng = point.getLatLng();
    return [latlng.lat, latlng.lng];
}