export class CanvasManager {
    #canvas;
    #focusHandler = this.#focus.bind(this);
    #keyDownHandler = this.#keyDown.bind(this);
    #clickHandler = this.#click.bind(this);
    #inputHandler = this.#input.bind(this);
    #schemaId;

    constructor(canvas, schemaId) {
        this.#canvas = canvas;
        this.#schemaId = schemaId;
        this.#canvas.addEventListener("focusin", this.#focusHandler);
        this.#canvas.addEventListener("keydown", this.#keyDownHandler);
        this.#canvas.addEventListener("click", this.#clickHandler);
        this.#canvas.addEventListener("focusout", this.#inputHandler);

        globalThis.designerCanvasRect = this.#canvas.getBoundingClientRect();
    }

    dispose() {
        this.#canvas.removeEventListener("focusin", this.#focusHandler);
        this.#canvas.removeEventListener("keydown", this.#keyDownHandler);
        this.#canvas.removeEventListener("click", this.#clickHandler);
        this.#canvas.removeEventListener("focusout", this.#inputHandler);
        this.#focusHandler = null;
        this.#clickHandler = null;
        this.#keyDownHandler = null;
        this.#inputHandler = null;
        this.#canvas = null;
        this.#schemaId = null;

        return null;
    }

    #getWidgetElement(element) {
        if (element.dataset.widgetId != null) {
            return element;
        }

        if (element.parentElement != null) {
            return this.#getWidgetElement(element.parentElement);
        }

        return null;
    }

    async #input(event) {
        const target = event.composedPath()[0];

        if (target.contentEditable !== "true") {
            return;
        }

        const value = target.textContent;

        if (target.dataset.property == null) {
            const path = target.dataset.path;
            const tagName = target.tagName.toLowerCase();

            await crsbinding.events.emitter.emit("schema-actions", {
                action: "update",
                args: [this.#schemaId, path, {
                    element: tagName,
                    content: value
                }]
            })
        }
        else {
            const widgetElement = this.#getWidgetElement(target);
            const property = target.dataset.property;
            const path = widgetElement.dataset.path;
            const tagName = widgetElement.tagName.toLowerCase();

            const argsOptions = { element: tagName };
            argsOptions[property] = value;

            await crsbinding.events.emitter.emit("schema-actions", {
                action: "update",
                args: [this.#schemaId, path, argsOptions]
            })
        }
    }

    async #click(event) {
        const target = event.composedPath()[0];

        if (target.dataset.widgetAction != null) {
            const action = target.dataset.widgetAction;
            const widgetElement = this.#getWidgetElement(target);
            const widgetId = widgetElement.dataset.widgetId;
            const {widget, script} = await crsbinding.events.emitter.emit("getWidgetLibrary", { id: widgetId });

            await script[action](widgetElement, target, widget, event);
        }
    }

    async #focus(event) {
        const elements = event.composedPath();

        for (const element of elements) {
            if (element.dataset.widgetId != null) {
                await crsbinding.events.emitter.emit("widget-selected", {
                    schemaId: this.#schemaId,
                    widgetId: element.dataset.widgetId,
                    element: element
                })

                break;
            }
        }

        event.stopPropagation();
    }

    async #keyDown(event) {
        if (event.key === "Delete") {
            return await this.delete(event);
        }

        if (event.key === "Escape") {
            return await this.selectDown(event);
        }
    }

    async delete(event) {
        const target = event.composedPath()[0];

        if (target.dataset.widgetId != null) {
            // JHR: todo - can someone replace this with the proper confirm dialog for On Key?
            const canDelete = confirm("Are you sure you want to delete this widget?");

            if (canDelete) {
                target.remove();
            }
        }
    }

    async selectDown(event) {
        let currentElement = event.composedPath()[1];

        while (currentElement != null) {
            if (currentElement.dataset.widgetId != null) {
                currentElement.focus();
                break;
            }

            currentElement = currentElement.parentElement;
        }
    }

    async setHTML(html) {
        this.#canvas.innerHTML = html;
    }
}