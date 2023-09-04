export class CellEditingActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }
}

class CellEditing {
    #store = {};
    #inHandler = this.#startEditing.bind(this);
    #outHandler = this.#endEditing.bind(this);
    #keyDownHandler = this.#keyDown.bind(this);

    constructor() {
        document.addEventListener("focusin", this.#inHandler, {capture: true, passive: true});
        document.addEventListener("focusout", this.#outHandler, {capture: true, passive: true});
        document.addEventListener("keydown", this.#keyDownHandler, {capture: true, passive: true});
    }

    dispose() {
        document.removeEventListener("focusin", this.#inHandler, {capture: true, passive: true});
        document.removeEventListener("focusout", this.#outHandler, {capture: true, passive: true});
        document.removeEventListener("keydown", this.#keyDownHandler, {capture: true, passive: true});

        crs.binding.utils.disposeProperties(this.#store);
        this.#store = null;
    }

    async #startEditing(event) {

    }

    async #endEditing(event) {

    }

    async #keyDown(event) {

    }

    register(name, definition, element, model) {
        this.#store[name] = {
            definition,
            model
        }

        element.dataset.def = name;
    }

    unregister(name) {
        if (this.#store[name != null]) {
            delete this.#store["definition"];
            delete this.#store["model"];
            delete this.#store;
        }
    }
}

crs.cell_editing = new CellEditing()