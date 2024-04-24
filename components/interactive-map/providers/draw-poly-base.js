export default class DrawPolyBase {
    // This class will start the drawing of a polygon on the map when the user clicks on the map.
    // Each click will add a new point to the polygon.
    // Then when mouse moves the polygon will be updated.
    // When the user right-clicks the mouse the polygon will be finished.
    // The polygon will be drawn on the map using the Leaflet library.
    // The class will also handle the events for the polygon drawing.

    #shape = null;
    #instance = null;
    #points = [];
    #subDivisionPoints = [];
    #isDragging = false;

    #disableNewPoints = false;

    #mouseDownHandler = this.#mouseDown.bind(this);
    #mouseUpHandler = this.#mouseUp.bind(this);
    #dragStartHandler = this.#dragStart.bind(this);

    #contextMenuHandler = this.#contextMenu.bind(this);
    #dragHandler = this.#drag.bind(this);

    get shapeKey() {
        throw new Error("Not implemented");
    }

    get minPoints() {
        return 3;
    }

    get closeShape() {
        return true;
    }

    set points(value) {
        this.#points = value;
    }

    async initialize(instance, shape) {
        this.#instance = instance;
        this.#instance.map.on("mousedown", this.#mouseDownHandler);
        this.#instance.map.on("mouseup", this.#mouseUpHandler);
        this.#instance.map.on("dragstart", this.#dragStartHandler);

        if (shape != null) {
            this.#disableNewPoints = true; // If we have a shape we don't want to add new points.
            await this.#drawHandles(shape);
            await this.#addSubDivisionMarkers();
            this.#shape = shape;
        }
    }

    async dispose() {
        this.#instance.map.off("mousedown", this.#mouseDownHandler);
        this.#instance.map.off("mouseup", this.#mouseUpHandler);
        this.#instance.map.off("dragstart", this.#dragStartHandler);
        this.#instance = null;

        for (const point of this.#points) {
            point.handle.off("drag", this.#dragHandler);
            point.handle.remove();
        }

        await this.#removeSubDivisionMarkers();
        this.#points = null;
        this.#mouseDownHandler = null;
        this.#contextMenuHandler = null;
    }

    async #mouseDown(event) {
        this.#isDragging = false;
        if (event.originalEvent.target.dataset.type === "subdivide") {
            return;
        }

        if (event.originalEvent.target.dataset.type === "draghandle") {
            await this.#removeSubDivisionMarkers();
        }
    }

    async #dragStart() {
        // When the user starts dragging we don't want to add new points.
        this.#isDragging = true;
    }

    async #mouseUp(event) {
        if (this.#isDragging === true) return;

        const isDragHandle = event.originalEvent.target.dataset.type === "draghandle";

        if (event.originalEvent.target.dataset.type === "subdivide") {
            // This fires when we click on a subdivision marker.
            this.#disableNewPoints = true;
            const index = Number(event.originalEvent.target.dataset.index);
            return this.#convertSubDivisionMarker(index);
        } else if (this.#disableNewPoints === false && isDragHandle === false) {
            // This fires when we are not dragging a draghandle and we want to add a new point.
            return this.#addPoint(event.latlng);
        }
        else if(this.#points.length > 1 && isDragHandle === true)  {
            // This fires when we are moving a draghandle and we want to re-add the subdivision markers.
            await this.#addSubDivisionMarkers();
        }
    }

    async #contextMenu(event) {
        await this.#removePoint(event.target.options.index);
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

    async #createDragHandle(coordinates, index) {
        const handle = await crs.call("interactive_map", "add_handle", {
            element: this.#instance,
            coordinates: [coordinates.lat, coordinates.lng],
            options: {
                draggable: true,
                index: index
            },
            type: "draghandle"
        });

        handle.on("drag", this.#dragHandler);
        handle.on("contextmenu", this.#contextMenuHandler);

        this.#points.splice(index, 0, {
            handle: handle,
            coordinates: [coordinates.lat, coordinates.lng]
        });
    }

    async #drawHandles(polygon) {
        let latLngs = polygon.getLatLngs();
        latLngs = Array.isArray(latLngs[0]) ? latLngs[0] : latLngs;


        for (let i = 0; i < latLngs.length; i++) {
            const latLng = latLngs[i];
            if (Array.isArray(latLng)) {
                await this.#drawHandles(latLng);
                continue;
            }
            await this.#createDragHandle(latLng, i);
        }
    }

    async #addPoint(coordinates, index = this.#points.length) {
        await this.#removeSubDivisionMarkers();
        await this.#createDragHandle(coordinates, index)

        // If the first point we do nothing
        if (this.#points.length < 2) return;


        if (this.#shape == null) {
            // If the shape is not yet created we create it.
            this.#shape = await crs.call("interactive_map", `add_${this.shapeKey}`, {
                coordinates: this.#points.map(_ => _.coordinates),
                element: this.#instance
            });
        } else {
            // If it already exists we just update the coordinates.
            await this.redraw();
        }

        await this.#addSubDivisionMarkers();
    }

    async #removePoint(index) {
        // When the user right-clicks a marker we want to remove the marker and remove the point at the index of the marker.
        const removedPoint = this.#points.splice(index, 1);
        removedPoint[0].handle.remove();

        // Recalculate the indexes of the markers.
        await this.#updateHandleIndexes();
        await this.redraw();
        await this.#removeSubDivisionMarkers();
        await this.#addSubDivisionMarkers();
    }

    async #addSubDivisionMarkers() {
        // Add a marker in the middle of the line between two points.
        // If last point we add a marker between the last and the first point.
        for (let i = 0; i < this.#points.length; i++) {
            const startCoordinates = this.#points[i];

            const isLastPoint = i === this.#points.length - 1;

            if (isLastPoint === true && this.closeShape === false) {
                // If closeShape is false we don't want to add a marker between the last and the first point.
                // This is because we only show lines when closeShape is false.
                return;
            }

            const endCoordinates = isLastPoint ? this.#points[0] : this.#points[i + 1];
            await this.#addSubDivisionMarker(startCoordinates, endCoordinates, i);
        }
    }

    async #addSubDivisionMarker(startCoordinates, endCoordinates, index) {
        const lat = (endCoordinates.coordinates[0] + startCoordinates.coordinates[0]) / 2;
        const lng = (endCoordinates.coordinates[1] + startCoordinates.coordinates[1]) / 2;

        const handle = await crs.call("interactive_map", "add_handle", {
            element: this.#instance,
            coordinates: [lat, lng],
            type: "subdivide",
            options: {
                index: index,
                fillColor: "red"
            }
        });

        this.#subDivisionPoints.push({
            handle: handle,
            coordinates: [lat, lng]
        });
    }

    async #removeSubDivisionMarkers() {
        // Remove all subdivision markers when the user starts drawing a new polygon.
        for (const point of this.#subDivisionPoints) {
            point.handle.remove();
        }
        this.#subDivisionPoints = [];
    }

    async #updateHandleIndexes() {
        this.#points.forEach((point, i) => {
            point.handle.options.index = i;
        });
    }

    async #convertSubDivisionMarker(index) {
        const point = this.#subDivisionPoints[index];
        const latlng = L.latLng(point.coordinates);
        const dragPointIndex = index + 1;
        await this.#addPoint(latlng, dragPointIndex);
        await this.#updateHandleIndexes();
        await this.#removeSubDivisionMarkers();
    }
}