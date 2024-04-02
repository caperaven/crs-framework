export default class DrawLine {
    // This class will start the drawing of a line on the map when the user clicks on the map.
    // It will then draw the line as the user moves the mouse and finish the drawing when the user clicks the mouse again.
    // The line will be drawn on the map using the Leaflet library.
    // The class will also handle the events for the line drawing.

    #line = null;
    #startPoint = null;
    #map = null;
    #mouseMoveHandler = this.#mouseMove.bind(this);
    #clickHandler = this.#click.bind(this);

    async initialize(map) {
        this.#map = map;
        this.#map.on("click", this.#clickHandler);
    }

    async dispose() {
        this.#map.off("mousemove", this.#mouseMoveHandler);
        this.#map.off("click", this.#clickHandler);
        this.#map = null;

        if(this.#line != null) {
            this.#line.remove();
        }
        this.#startPoint = null;
        this.#mouseMoveHandler = null;
        this.#clickHandler = null;
    }

    async #click(event) {
        if (this.#line != null) {
            // If the line is already drawn, remove it from the map.
            this.#line = null;
            this.#map.off("mousemove", this.#mouseMoveHandler);
            this.#startPoint = null;
            return;
        }

        this.#map.on("mousemove", this.#mouseMoveHandler);
        this.#startPoint = event.latlng;
        this.#line = L.polyline([[this.#startPoint.lat, this.#startPoint.lng], [this.#startPoint.lat, this.#startPoint.lng]], {color: 'red'}).addTo(this.#map);
        this.#line.type = "line";
    }

    async #mouseMove(event) {
        // Update the line as the user moves the mouse based of the start point and the current mouse position.
        this.#line.setLatLngs([[this.#startPoint.lat, this.#startPoint.lng], [event.latlng.lat, event.latlng.lng]]);
    }
}