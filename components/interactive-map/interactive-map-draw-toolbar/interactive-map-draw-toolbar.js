export class InteractiveMapDrawToolbar extends crsbinding.classes.BindableElement {
    #instance = null;
    #modeChangedEventHandler = this.onModeChanged.bind(this);
    #selectionChangedEventHandler = this.onSelectionChanged.bind(this);


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
    }

    async onSelectionChanged(event) {
        this.setProperty("selectedIndex", event.detail.index);
    }

    async setMode(mode) {
        if (this.#instance == null) return;
        await crs.call("interactive_map", "set_mode", {
            element: this.#instance,
            mode: mode
        });
    }

    async removeSelected() {
        const index = this.getProperty("selectedIndex");

        if(this.#instance == null) return;

        await crs.call("interactive_map", "set_mode", {
            element: this.#instance,
            mode: "none"
        });

        await crs.call("interactive_map", "remove_record", {
            element: this.#instance,
            index: index,
            layer: this.#instance.activeLayer
        });

        this.setProperty("selectedIndex", null);
    }

    async discard() {
        if(this.#instance == null) return;
        await crs.call("interactive_map", "cancel_mode", {
            element: this.#instance
        });
    }

    async accept() {
        if(this.#instance == null) return;
        await crs.call("interactive_map", "accept_mode", {
            element: this.#instance
        });
    }
}

customElements.define("interactive-map-draw-toolbar", InteractiveMapDrawToolbar);