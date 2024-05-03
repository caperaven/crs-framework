// import { loadHTML } from "./../../../dist/src/load-resources.js";
// import "./../../dialogs/dialogs-actions.js";
// import "./../../context-menu/context-menu-actions.js";

class SlaMeasurement extends crsbinding.classes.BindableElement {
    // ToDo: AW - See if we can use this convention instead of all the handlers
    // #mouseEventHandlers = {
    //     "mouseenter": this.#mouseEnter.bind(this),
    //     "mouseleave": this.#mouseLeave.bind(this)
    // }

    #mouseEventHandler = this.#mouseEvent.bind(this);
    #clickHandler = this.#click.bind(this);
    #contextMenuHandler = this.#contextMenu.bind(this);

    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async connectedCallback() {
        await super.connectedCallback();
        // this.shadowRoot.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(response => response.text());
        await this.load();
        this.addEventListener("mouseenter", this.#mouseEventHandler);
        this.addEventListener("mouseleave", this.#mouseEventHandler);
        this.addEventListener("click", this.#clickHandler);
        this.addEventListener("contextmenu", this.#contextMenuHandler);
    }

    async load() {
        return new Promise(resolve => {
            requestAnimationFrame(async () => {

                this.dataset.status = "loading";
                this.dispatchEvent(new CustomEvent("loading-measurement"));
                resolve();
            });
        });
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
        this.removeEventListener("mouseenter", this.#mouseEventHandler);
        this.removeEventListener("mouseleave", this.#mouseEventHandler);
        this.removeEventListener("click", this.#clickHandler);
        this.removeEventListener("contextmenu", this.#contextMenuHandler);
        this.#mouseEventHandler = null;
        this.#clickHandler = null;
        this.#contextMenuHandler = null;
    }

    async #mouseEvent(event) {
        const parent = event.composedPath()[0].getRootNode().host;

        await crs.call("sla_measurement", "display_measurement_info", {
            element: event.composedPath()[0],
            type: event.type
        });


    }

    async #click(event) {
        const measurement = event.composedPath()[0];
        const parentElement = event.composedPath()[0].getRootNode().host;

        if (measurement.dataset.parentPhase === "setup") {
            await crs.call("sla_measurement", "select_measurement", {
                element: event.composedPath()[0],
                measurementParent: parentElement
            });
        }

    }

    async #contextMenu(event) {
        event.preventDefault();
        const measurement = event.composedPath()[0];
        const parentElement = event.composedPath()[0].getRootNode().host;

        if (measurement.dataset.parentPhase === "setup") {
            await crs.call("context_menu", "show", {
                element: event.composedPath()[0],
                icon_font_family: "crsfrw",
                at: 'bottom',
                height: "max-content",
                options: [
                    { id: "item1", title: "Edit", tags: "edit", icon: "edit", selected: true,  type: "console", action: "log", args: { message: "Edit "}, attributes: { "aria-hidden.if": "status == 'b'" } },
                    { id: "item3", title: "Delete", tags: "delete", icon: "delete", icon_color: "var(--red)", type: "sla_measurement", action: "remove_measurement", args: { element: this.getRootNode().host.getRootNode().host} },
                    { title: "-" }
                ],
            });
        }
    }


}

customElements.define("sla-measurement", SlaMeasurement);
