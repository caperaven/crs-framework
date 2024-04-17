export default class DrawPoint {

    #map = null;
    #clickHandler = this.#click.bind(this);
    #point = null;

    async initialize(map) {
        this.#map = map;
        this.#map.on("click", this.#clickHandler);
    }

    async dispose() {
        this.#map.off("click", this.#clickHandler);
        this.#map = null;

        this.#point = null;
    }

    async #click(event) {
        if(this.#point != null) {
           this.#point.remove();
        }

        this.#point = await crs.call("interactive_map", "add_point", {coordinates: [event.latlng.lat, event.latlng.lng], element: this.#map});
    }
}