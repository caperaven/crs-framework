export class CanvasManager {
    #canvas;
    #clickHandler = this.#click.bind(this);

    constructor(canvas) {
        this.#canvas = canvas;
        this.#canvas.addEventListener("click", this.#clickHandler);
    }

    dispose() {
        this.#canvas.removeEventListener("click", this.#clickHandler);
        this.#clickHandler = null;
        this.#canvas = null;
        return null;
    }

    async #click(event) {
        const elements = event.composedPath();

        for (const element of elements) {
            if (element.dataset.widgetId != null) {
                await crsbinding.events.emitter.emit("widget-selected", {
                    widgetId: element.dataset.widgetId,
                    element: element
                })

                break;
            }
        }
    }
}