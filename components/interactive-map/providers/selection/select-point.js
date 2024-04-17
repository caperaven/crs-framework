export default class SelectPoint {
    #map = null;
    #clickHandler = this.#click.bind(this);
    #point = null;
    #element = null;
    async initialize(map, point, element) {
        this.#map = map;

        if (point != null) {
            this.#point = point;
            this.#point.dragging.enable();
            this.#element = element;
            this.#element.classList.add("selected");
        }
    }
    async dispose() {
        this.#map = null;
        this.#point.dragging.disable();
        this.#point = null;

        this.#element.classList.remove("selected");
        this.#element = null;
    }
    async #click(event) {
        if(this.#point != null) {
            this.#point.remove();
        }
        this.#point = await crs.call("interactive_map", "add_point", {coordinates: [event.latlng.lat, event.latlng.lng], element: this.#map});
    }
}