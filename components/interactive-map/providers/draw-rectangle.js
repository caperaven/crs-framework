export default class DrawRectangle {
    // This class will start the drawing of a rectangle on the map when the user clicks on the map.
    // It will then draw the rectangle as the user moves the mouse and finish the drawing when the user clicks the mouse again.
    // The rectangle will be drawn on the map using the Leaflet library.
    // The class will also handle the events for the rectangle drawing.

    #rectangle = null;
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

        if(this.#rectangle != null) {
            this.#rectangle.remove();
        }
    }

    async #click(event) {
        if(this.#rectangle != null) {
            // If the rectangle is already drawn, remove it from the map.
            this.#rectangle = null;
            this.#map.off("mousemove", this.#mouseMoveHandler);
            this.#startPoint = null;
            return;
        }


        this.#map.on("mousemove", this.#mouseMoveHandler);
        this.#startPoint = event.latlng;
        this.#rectangle = await crs.call("interactive_map", "add_rectangle", {coordinates: [[this.#startPoint.lat, this.#startPoint.lng], [this.#startPoint.lat, this.#startPoint.lng]], element: this.#map});
    }

    async #mouseMove(event) {
       // Update the rectangle as the user moves the mouse based of the start point and the current mouse position.
        this.#rectangle.setBounds([[this.#startPoint.lat, this.#startPoint.lng], [event.latlng.lat, event.latlng.lng]]);
    }

}