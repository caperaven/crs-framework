import {getShapeIndex} from "../interactive-map-utils.js";

export default class DrawPolyBase {
    // This class will start the drawing of a polygon on the map when the user clicks on the map.
    // Each click will add a new point to the polygon.
    // Then when mouse moves the polygon will be updated.
    // When the user right-clicks the mouse the polygon will be finished.
    // The polygon will be drawn on the map using the Leaflet library.
    // The class will also handle the events for the polygon drawing.

    #shape = null;
    #subDivisionLine = null;
    #subDivisionLinePoints = [];
    #originalPoints = null;

    #instance = null;
    #points = [];
    #selectedPoints = [];
    #subDivisionPoints = [];


    #disableNewPoints = false;

    #pointClickHandler = this.#pointClick.bind(this);
    #pointDragStartHandler = this.#pointDragStart.bind(this);
    #pointDragHandler = this.#pointDrag.bind(this);
    #pointDragEndHandler = this.#pointDragEnd.bind(this);
    #pointContextMenuHandler = this.#pointContextMenu.bind(this);

    #subPointDragStartHandler = this.#subPointDragStart.bind(this);
    #subPointDragHandler = this.#subPointDrag.bind(this);
    #subPointDragEndHandler = this.#subPointDragEnd.bind(this);

    #clickHandler = this.#click.bind(this);
    #isEditing = false;


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
        this.#instance.map.on("click", this.#clickHandler);

        if (shape != null) {
            this.#disableNewPoints = true; // If we have a shape we don't want to add new points.
            await this.#drawHandles(shape);
            await this.#addSubDivisionMarkers();
            this.#shape = shape;
            this.#isEditing = true;
        }
    }

    async dispose() {
        if (this.#shape != null) {
            this.#shape = null;
        }

        this.#instance.map.off("click", this.#clickHandler);
        this.#instance = null;

        for (const point of this.#points) {
            point.handle.off("drag", this.#pointDragHandler);
            point.handle.remove();
        }

        await this.#removeSubDivisionMarkers();
        this.#points = null;
        this.#clickHandler = null;
        this.#pointContextMenuHandler = null;
        this.#subPointDragStartHandler = null;
        this.#subPointDragHandler = null;
        this.#subPointDragEndHandler = null;
        this.#pointDragStartHandler = null;
        this.#pointDragHandler = null;
        this.#pointDragEndHandler = null;
        this.#pointClickHandler = null;
    }

    async redraw() {
        if (this.#shape != null && this.#points.length < this.minPoints) {
            this.#shape.remove();
            this.#shape = null;
            return;
        }
        this.#shape.setLatLngs(this.#points.map(_ => _.coordinates));
    }

    async cancel() {
        if (this.#shape != null) {
            const index = getShapeIndex(this.#shape);
            await crs.call("data_manager", "set_selected", {manager: this.#instance.dataset.manager, indexes: [index], selected: false});
           // Remove temp shape and also redraw the original shape if editing was true

            await crs.call("interactive_map", "redraw_record", {
                element: this.#instance,
                index: index,
                layer: this.#instance.activeLayer
            });
        }
    }

    async accept() {
        if (this.#shape != null) {


            if (this.#isEditing === true) {
                const index = getShapeIndex(this.#shape);

                let changes = {}
                // Get the changes from either shape options or feature properties
                if (this.#shape.feature) {
                   changes.geographicLocation = this.#shape.toGeoJSON()
                }
                else {
                    changes.coordinates =  latLngsToCoordinates(this.#shape);
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
                await crs.call("data_manager", "append", {
                    records: [{
                        coordinates: latLngsToCoordinates(this.#shape),
                        type: this.shapeKey
                    }],
                    manager: this.#instance.dataset.manager,
                    is_dirty: true
                });
            }

            this.#shape.remove();
            this.#shape = null;
        }
    }

    async #pointClick(event) {
        // When selecting a point we to change the style of the point to selected.
        // We also want to add it to the selected points array.

        const index = event.target.options.index;
        const point = this.#points[index];

        if (this.#selectedPoints.includes(point)) {
            // If the point is already selected we want to deselect it.
            event.target.setStyle({fillColor: "blue"});
            this.#selectedPoints = this.#selectedPoints.filter(_ => _ !== point);
        }
        else {
            // If the point is not selected we want to select it.
            event.target.setStyle({fillColor: "green"});
            this.#selectedPoints.push(point);
        }
    }

    async #pointDragStart(event) {
        await this.#removeSubDivisionMarkers();
    }

    async #pointDrag(event) {
        // Update the shape as the user moves the mouse based on the current mouse position.
        this.#points[event.target.options.index].coordinates = [event.latlng.lat, event.latlng.lng];
        await this.redraw();
    }

    async #pointDragEnd(event, test) {
        await this.#addSubDivisionMarkers();
    }

    async #pointContextMenu(event) {
        return await this.#removePoint(event.target.options.index);
    }

    async #subPointDragStart(event) {
        const lastPointIndex =  (event.target.options.index + 1) >= this.#points.length ? 0 : event.target.options.index + 1;
        const lastPoint = this.#points[lastPointIndex].coordinates;

        this.#subDivisionLinePoints = [this.#points[event.target.options.index].coordinates, this.#subDivisionPoints[event.target.options.index].coordinates , lastPoint];


        const element = event.target.getElement();
        element.firstChild.dataset.type = "draghandle";


        const index = event.target.options.index;
        const dragPointIndex = index + 1;
        await this.#addPoint(dragPointIndex, event.target.getLatLng(), null);
    }

    async #subPointDrag(event) {
        const index = event.target.options.index + 1;
        this.#points[index].coordinates = [event.latlng.lat, event.latlng.lng];

        await this.redraw();
    }

    async #subPointDragEnd(event) {
        // if (this.#subDivisionLine == null)  return;
        this.#disableNewPoints = true;

        const index = event.target.options.index +1;

        const handle = await this.#createDragHandle(event.target.getLatLng(), index);


        this.#points[index].handle = handle;

        await this.#updateHandleIndexes();
        await this.#removeSubDivisionMarkers();
        await this.#addSubDivisionMarkers();
    }


    async #click(event) {
        if (this.#disableNewPoints === true) {
            return;
        }

        await this.#addNewPoint(event.latlng);
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

        handle.on("click", this.#pointClickHandler);
        handle.on("dragstart", this.#pointDragStartHandler);
        handle.on("dragend", this.#pointDragEndHandler);
        handle.on("drag", this.#pointDragHandler);
        handle.on("contextmenu", this.#pointContextMenuHandler);

        return handle;
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
            const handle = await this.#createDragHandle(latLng, i);
            await this.#addPoint(i, latLng, handle);
        }
    }

    async #addNewPoint(coordinates, index = this.#points.length) {
        await this.#removeSubDivisionMarkers();
        const handle = await this.#createDragHandle(coordinates, index)
        await this.#addPoint(index, coordinates, handle);

        // If the first point we do nothing
        if (this.#points.length < 2) return;


        if (this.#shape == null) {
            // If the shape is not yet created we create it.
            this.#shape = await crs.call("interactive_map", "add_shape", {
                layer: this.#instance.activeLayer,
                data: {
                    type: this.shapeKey,
                    coordinates: this.#points.map(_ => _.coordinates),
                    options: {
                        color: this.#instance.map.selectionColor
                    }
                },
                element: this.#instance,
            });
        } else {
            // If it already exists we just update the coordinates.
            await this.redraw();
        }

        await this.#addSubDivisionMarkers();
    }

    async #addPoint(index, coordinates, handle) {
        const newPoint = {
            handle: handle,
            coordinates: [coordinates.lat, coordinates.lng]
        };
        this.#points.splice(index, 0, newPoint);
        return newPoint;
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
                draggable: true,
                fillColor: "red"
            }
        });

        handle.on("dragstart", this.#subPointDragStartHandler);
        handle.on("drag", this.#subPointDragHandler);
        handle.on("dragend", this.#subPointDragEndHandler);

        this.#subDivisionPoints.push({
            handle: handle,
            coordinates: [lat, lng]
        });
    }

    async #removeSubDivisionMarkers() {
        // Remove all subdivision markers when the user starts drawing a new polygon.
        for (const point of this.#subDivisionPoints) {
            point.handle.off("dragstart", this.#subPointDragStartHandler);
            point.handle.off("drag", this.#subPointDragHandler);
            point.handle.off("dragend", this.#subPointDragEndHandler);

            point.handle.remove();
        }
        this.#subDivisionPoints = [];
    }

    async #updateHandleIndexes() {
        this.#points.forEach((point, i) => {
            point.handle.options.index = i;
        });
    }

}

function latLngsToCoordinates(shape) {
    let latLngs = shape.getLatLngs();
    latLngs = Array.isArray(latLngs[0]) ? latLngs[0] : latLngs;

    return latLngs.map(_ => [_.lat, _.lng]);
}