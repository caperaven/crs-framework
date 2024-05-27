export class InteractiveMapDrawToolbar extends crsbinding.classes.BindableElement {
    #instance = null;

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async disconnectedCallback() {
        this.#instance = null;
        await super.disconnectedCallback();
    }

    async setInstance(instance) {
        this.#instance = instance;
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

    async discard() {
        if(this.#instance == null) return;
        await crs.call("interactive_map", "cancel_polygon", {
            element: this.#instance
        });
        this.setProperty("mode", null);
    }

    async accept() {
        if(this.#instance == null) return;
        await crs.call("interactive_map", "accept_polygon", {
            element: this.#instance
        });
        this.setProperty("mode", null);

    }
}

customElements.define("interactive-map-draw-toolbar", InteractiveMapDrawToolbar);