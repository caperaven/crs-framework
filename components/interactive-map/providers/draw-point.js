export default class DrawPoint {

    #instance = null;
    #clickHandler = this.#click.bind(this);
    #point = null;

    async initialize(instance) {
        this.#instance = instance;
        this.#instance.map.on("click", this.#clickHandler);
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

        this.#point = await crs.call("interactive_map", "add_point", {coordinates: [event.latlng.lat, event.latlng.lng], element: this.#instance});
    }
}