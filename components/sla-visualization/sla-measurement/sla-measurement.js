// import { loadHTML } from "./../../../dist/src/load-resources.js";
// import "./../../dialogs/dialogs-actions.js";
// import "./../../context-menu/context-menu-actions.js";

class SlaMeasurement extends HTMLElement {
    // ToDo: AW - See if we can use this convention instead of all the handlers
    // #mouseEventHandlers = {
    //     "mouseenter": this.#mouseEnter.bind(this),
    //     "mouseleave": this.#mouseLeave.bind(this)
    // }

    #mouseEnterEventHandler = this.#mouseEnterEvent.bind(this);
    #mouseLeaveEventHandler = this.#mouseLeaveEvent.bind(this);
    #clickHandler = this.#click.bind(this);
    #contextMenuHandler = this.#contextMenu.bind(this);
    #measurementInfoElement;

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(response => response.text());
        await this.load();
        this.addEventListener("mouseenter", this.#mouseEnterEventHandler);
        this.addEventListener("mouseleave", this.#mouseLeaveEventHandler);
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
        this.removeEventListener("mouseenter", this.#mouseEnterEventHandler);
        this.removeEventListener("mouseleave", this.#mouseLeaveEventHandler);
        this.removeEventListener("click", this.#clickHandler);
        this.removeEventListener("contextmenu", this.#contextMenuHandler);
        this.#mouseEnterEventHandler = null;
        this.#mouseLeaveEventHandler = null;
        this.#clickHandler = null;
        this.#contextMenuHandler = null;
        this.#measurementInfoElement = null;
    }

    async #mouseEnterEvent(event) {
        const parent = event.composedPath()[0].getRootNode().host;

        if(event.type === "mouseenter") {
            this.#measurementInfoElement = await crs.call("sla_measurement", "display_measurement_info", {
                element: this,
                type: event.type,
                parent: parent
            });
        }
    }

    async #mouseLeaveEvent(event) {
        requestAnimationFrame(()=> {
            this.#measurementInfoElement?.remove();
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

            const selectedElements = parentElement.shadowRoot.querySelectorAll("sla-measurement[data-selected='true']")
            const selectedMeasurements = Array.from(selectedElements).map(element => ({
                id: parseInt(element.id),
                version: parseInt(element.dataset.version) || 1
            }));
            this.shadowRoot.dispatchEvent(new CustomEvent("measurement-selected", {detail: {selected: selectedMeasurements}, bubbles: true,
                composed: true}));
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
