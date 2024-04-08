export default class DrawPolyBase {
    // This class will start the drawing of a polygon on the map when the user clicks on the map.
    // Each click will add a new point to the polygon.
    // Then when mouse moves the polygon will be updated.
    // When the user right-clicks the mouse the polygon will be finished.
    // The polygon will be drawn on the map using the Leaflet library.
    // The class will also handle the events for the polygon drawing.

    #shape = null;
    #map = null;
    #points = [];

    #clickHandler = this.#click.bind(this);
    #contextMenuHandler = this.#contextMenu.bind(this);
    #dragHandler = this.#drag.bind(this);

    get shapeKey() {
        throw new Error("Not implemented");
    }

    get minPoints() {
        return 3;
    }

    set points(value) {
        this.#points = value;
    }

    async initialize(map, shape) {
        this.#map = map;
        this.#map.on("click", this.#clickHandler);

        if (shape != null) {
            await this.#drawHandles(shape);
            this.#shape = shape;
        }
    }

    async dispose() {
        this.#map.off("click", this.#clickHandler);
        this.#map = null;

        for (const point of this.#points) {
            point.handle.off("drag", this.#dragHandler);
            point.handle.remove();
        }

        this.#points = null;
        this.#clickHandler = null;
        this.#contextMenuHandler = null;
    }

    async #click(event) {
        await this.#createHandle(event.latlng, this.#points.length);
        if (this.#points.length < this.minPoints) return;

        if (this.#shape == null) {
            this.#shape = await crs.call("interactive_map", `add_${this.shapeKey}`, {
                coordinates: this.#points.map(_ => _.coordinates),
                element: this.#map
            });
        } else {
            await this.redraw();
        }
    }

    async #contextMenu(event) {
        // When the user right clicks a marker we want to remove the marker and remove the point at the index of the marker.
        const index = event.target.options.index;
        const removedPoint = this.#points.splice(index, 1);
        removedPoint[0].handle.remove();

        // Recalculate the indexes of the markers.
        this.#points.forEach((point, i) => {
            point.handle.options.index = i;
        });
        await this.redraw();
    }

    async redraw() {
        if (this.#shape != null && this.#points.length < this.minPoints) {
            this.#shape.remove();
            this.#shape = null;
            return;
        }
        this.#shape.setLatLngs(this.#points.map(_ => _.coordinates));
    }


    async #drag(event) {
        // Update the shape as the user moves the mouse based on the current mouse position.
        this.#points[event.target.options.index].coordinates = [event.latlng.lat, event.latlng.lng];
        await this.redraw();
    }

    async #createHandle(coordinates) {
        const handle = await crs.call("interactive_map", "add_drag_handle", {
            element: this.#map,
            coordinates: [coordinates.lat, coordinates.lng],
            options: {index: this.#points.length}
        });

        handle.on("drag", this.#dragHandler);
        handle.on("contextmenu", this.#contextMenuHandler);

        this.#points.push(
            {
                handle: handle,
                coordinates: [coordinates.lat, coordinates.lng]
            });
    }

    async #drawHandles(polygon) {
        let latLngs = polygon.getLatLngs();
        latLngs = Array.isArray(latLngs[0]) ? latLngs[0] : latLngs;

        for (const latLng of latLngs) {
            if (Array.isArray(latLng)) {
                await this.#drawHandles(latLng);
                continue;
            }
            await this.#createHandle(latLng);
        }
    }
}