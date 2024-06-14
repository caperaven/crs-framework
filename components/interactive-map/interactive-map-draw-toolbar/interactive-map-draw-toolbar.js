import {getShapeProperty} from "../interactive-map-utils.js";

export class InteractiveMapDrawToolbar extends crsbinding.classes.BindableElement {
    #instance = null;
    #modeChangedEventHandler = this.onModeChanged.bind(this);
    #selectionChangedEventHandler = this.onSelectionChanged.bind(this);

    #createModes = ["draw-point", "draw-polyline", "draw-polygon"];


    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async connectedCallback() {
        this.setProperty("mode", "none");
        await super.connectedCallback();
    }

    async disconnectedCallback() {
        this.#instance.removeEventListener("mode-changed", this.#modeChangedEventHandler);
        this.#modeChangedEventHandler = null;

        this.#instance.removeEventListener("selection-changed", this.#selectionChangedEventHandler);
        this.#selectionChangedEventHandler = null;

        this.#instance = null;

        await super.disconnectedCallback();
    }

    async setInstance(instance) {
        this.#instance = instance;
        this.#instance.addEventListener("mode-changed", this.#modeChangedEventHandler);
        this.#instance.addEventListener("selection-changed", this.#selectionChangedEventHandler);
    }

    async onModeChanged(event) {
        if (event.detail == null) return;
        this.setProperty("mode", event.detail.mode);
        if (this.#instance.maxShapes > 0) {
            const maxReached = await this.#evaluateIfMaxShapesReached();
            maxReached ? this.classList.add("max-reached") : this.classList.remove("max-reached");
        }
    }

    async onSelectionChanged(event) {
        this.setProperty("selectedIndex", event.detail.index);
    }

    async setMode(mode) {
        if (this.#instance == null) return;

        if (this.#instance.maxShapes > 0 && this.#createModes.indexOf(mode) !== -1) {
            const maxReached = await this.#evaluateIfMaxShapesReached();
            if (maxReached === true) {
                await crsbinding.events.emitter.emit("toast", {type: "error", message: crsbinding.translations.get("interactiveMap.maxShapesReached")});
                return;
            }
        }

        await crs.call("interactive_map", "set_mode", {
            element: this.#instance,
            mode: mode
        });
    }

    async removeSelected() {
        const index = this.getProperty("selectedIndex");

        if (this.#instance == null) return;

        await crs.call("data_manager", "remove", {
            manager: this.#instance.dataset.manager,
            indexes: [index]
        });

        await crs.call("interactive_map", "set_mode", {
            element: this.#instance,
            mode: "none"
        });

        this.setProperty("selectedIndex", null);
    }

    async discard() {
        if (this.#instance == null) return;
        await crs.call("interactive_map", "cancel_mode", {
            element: this.#instance
        });
    }

    async accept() {
        if (this.#instance == null) return;
        await crs.call("interactive_map", "accept_mode", {
            element: this.#instance
        });
    }

    async #evaluateIfMaxShapesReached() {
        if (this.#instance.maxShapes == 0) return false;
        const records = await crs.call("data_manager", "get_all", {
            manager: this.#instance.dataset.manager
        });

        let count = 0;
        for (const record of records) {
            if (getShapeProperty(record, "readonly") !== true) {
                count++;
            }
        }

        return count >= this.#instance.maxShapes;
    }
}

customElements.define("interactive-map-draw-toolbar", InteractiveMapDrawToolbar);