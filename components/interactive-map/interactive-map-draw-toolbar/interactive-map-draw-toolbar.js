export class InteractiveMapDrawToolbar extends crsbinding.classes.BindableElement {
    #instance = null;
    #selectionHandler = this.#selectionChanged.bind(this);

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async disconnectedCallback() {
        this.#instance.removeEventListener("shapeSelected", this.#selectionHandler);
        this.#instance = null;
        this.#selectionHandler = null;
        await super.disconnectedCallback();
    }

    async preLoad() {
        this.setProperty("toolbar", "My binding toolbar");
    }

    async setInstance(instance) {
        this.#instance = instance;
        this.#instance.addEventListener("shapeSelected", this.#selectionHandler);
    }


    async modeChanged(mode) {
        if (this.#instance == null) return;
        await crs.call("interactive_map", "set_mode", {
            element: this.#instance,
            mode: mode
        });
    }

    async removeSelected() {
        if(this.#instance == null) return;
        await crs.call("interactive_map", "remove_selected", {
            element: this.#instance
        });
    }

    async #selectionChanged(event) {
        console.log("Shape selected", event);
    }
}

customElements.define("interactive-map-draw-toolbar", InteractiveMapDrawToolbar);