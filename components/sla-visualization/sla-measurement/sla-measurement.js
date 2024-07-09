import "./../../context-menu/context-menu-actions.js";

class SlaMeasurement extends HTMLElement {
    #mouseEnterHandler = this.#mouseEnter.bind(this);
    #mouseLeaveHandler = this.#mouseLeave.bind(this);
    #clickHandler = this.#click.bind(this);
    #contextMenuHandler = this.#contextMenu.bind(this);

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
        this.addEventListener("mouseenter", this.#mouseEnterHandler);
        this.addEventListener("mouseleave", this.#mouseLeaveHandler);
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
        this.removeEventListener("mouseenter", this.#mouseEnterHandler);
        this.removeEventListener("mouseleave", this.#mouseLeaveHandler);
        this.removeEventListener("click", this.#clickHandler);
        this.removeEventListener("contextmenu", this.#contextMenuHandler);
        this.#mouseEnterHandler = null;
        this.#mouseLeaveHandler = null;
        this.#clickHandler = null;
        this.#contextMenuHandler = null;
    }

    async #mouseEnter(event) {
        await this.#dispatchCustomPopupEvent(this);
    }

    async #mouseLeave(event) {
        await this.#dispatchCustomPopupEvent();
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
            this.shadowRoot.dispatchEvent(new CustomEvent("measurement-selected", {detail: {selected: selectedMeasurements}, bubbles: true, composed: true}));
        }
    }

    async #dispatchCustomPopupEvent(measurement = null) {
        this.dispatchEvent(new CustomEvent("measurement-hovered", {detail: {measurement}, bubbles: true, composed: true}));
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
                filtering: false,
                options: [
                    { id: "item1", title: "Edit", tags: "edit", icon: "edit", type: "console", action: "log", args: { message: "Edit "}, attributes: { "aria-hidden.if": "status == 'b'" } },
                    { id: "item3", title: "Delete", tags: "delete", icon: "delete", icon_color: "var(--red)", type: "sla_measurement", action: "remove_measurement", args: { element: this} }
                ],
            });
        }
    }


}

customElements.define("sla-measurement", SlaMeasurement);
