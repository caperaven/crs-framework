export default class DrawPolygon {
    // This class will start the drawing of a polygon on the map when the user clicks on the map.
    // Each click will add a new point to the polygon.
    // Then when mouse moves the polygon will be updated.
    // When the user right-clicks the mouse the polygon will be finished.
    // The polygon will be drawn on the map using the Leaflet library.
    // The class will also handle the events for the polygon drawing.

    #polygon = null;
    #map = null;
    #polygonCoordinates = [];
    #clickHandler = this.#click.bind(this);
    #contextMenuHandler = this.#contextMenu.bind(this);
    #mouseMoveHandler = this.#mouseMove.bind(this);

    async initialize(map) {
        this.#map = map;
        this.#map.on("click", this.#clickHandler);
        this.#map.on("contextmenu", this.#contextMenuHandler);
    }

    async dispose() {
        this.#map.off("click", this.#clickHandler);
        this.#map.off("contextmenu", this.#contextMenuHandler);
        this.#map.off("mousemove", this.#mouseMoveHandler);
        this.#map = null;

        if(this.#polygon != null) {
            this.#polygon.remove();
        }
        this.#polygonCoordinates = null;
        this.#clickHandler = null;
        this.#contextMenuHandler = null;
        this.#mouseMoveHandler = null;
    }

    async #click(event) {
        this.#polygonCoordinates.push([event.latlng.lat, event.latlng.lng]);
        if(this.#polygon == null) {
            this.#polygon = await crs.call("interactive_map", "add_polygon", {coordinates: this.#polygonCoordinates, element: this.#map});

            this.#map.on("mousemove", this.#mouseMoveHandler);
        }
        else {
            this.#polygon.setLatLngs(this.#polygonCoordinates);
        }
    }

    async #contextMenu(event) {
        // Finish the polygon when the user right-clicks the mouse.
        if(this.#polygon != null) {
            this.#map.off("mousemove", this.#mouseMoveHandler);
            this.#polygon = null;
            this.#polygonCoordinates = [];
        }
    }

    async #mouseMove(event) {
        // Update the polygon as the user moves the mouse based on the current mouse position.
        this.#polygonCoordinates[this.#polygonCoordinates.length - 1] = [event.latlng.lat, event.latlng.lng];
        this.#polygon.setLatLngs(this.#polygonCoordinates);
    }
}