export default class DrawCircle {
    // This class will start the drawing of a circle on the map when the user clicks on the map.
    // It will then draw the circle as the user moves the mouse and finish the drawing when the user clicks the mouse again.
    // The circle will be drawn on the map using the Leaflet library.
    // The class will also handle the events for the circle drawing.

    #circle = null;
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

        if(this.#circle != null) {
            this.#circle.remove();
        }
    }

    async #click(event) {
        if(this.#circle != null) {
            // If the circle is already drawn, remove it from the map.
            this.#circle = null;
            this.#map.off("mousemove", this.#mouseMoveHandler);
            this.#startPoint = null;
            return;
        }

        this.#map.on("mousemove", this.#mouseMoveHandler);
        this.#startPoint = event.latlng;
        this.#circle = L.circle([this.#startPoint.lat, this.#startPoint.lng], 0, {color: 'red'}).addTo(this.#map);
    }

    async #mouseMove(event) {
        // Update the circle as the user moves the mouse based of the start point and the current mouse position.
        const distance = this.#startPoint.distanceTo(event.latlng);
        this.#circle.setRadius(distance);
    }
}