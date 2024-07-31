import "./../../context-menu/context-menu-actions.js";

/**
 * @class SlaMeasurementActions - This component is responsible for rendering the SLA measurement
 */
class SlaMeasurement extends HTMLElement {
    #mouseEnterHandler = this.#mouseEnter.bind(this);
    #mouseLeaveHandler = this.#mouseLeave.bind(this);

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(response => response.text());
        await this.load();
        this.addEventListener("mouseenter", this.#mouseEnterHandler);
        this.addEventListener("mouseleave", this.#mouseLeaveHandler);
    }

    /**
     * @method load - Loads the sla-measurement component
     * @returns {Promise<unknown>}
     */
    async load() {
        return new Promise(resolve => {
            requestAnimationFrame(async () => {
                this.dataset.status = "ready";
                this.dispatchEvent(new CustomEvent("measurement-loaded"));
                resolve();
            });
        });
    }

    async disconnectedCallback() {
        this.removeEventListener("mouseenter", this.#mouseEnterHandler);
        this.removeEventListener("mouseleave", this.#mouseLeaveHandler);
        this.#mouseEnterHandler = null;
        this.#mouseLeaveHandler = null;
    }

    /**
     * @method #mouseEnter - Dispatches a custom event when the mouse enters the measurement
     * @param event {MouseEvent} - The mouse event
     * @returns {Promise<void>}
     */
    async #mouseEnter(event) {
        await this.#dispatchCustomPopupEvent(this);
    }

    /**
     * @method #mouseLeave - Dispatches a custom event when the mouse leaves the measurement
     * @param event {MouseEvent} - The mouse event
     * @returns {Promise<void>}
     */
    async #mouseLeave(event) {
        await this.#dispatchCustomPopupEvent();
    }

    /**
     * @method #dispatchCustomPopupEvent - Dispatches a custom event
     * @param measurement {Object} - The measurement object
     * @returns {Promise<void>}
     */
    async #dispatchCustomPopupEvent(measurement = null) {
        this.dispatchEvent(new CustomEvent("measurement-hovered", {detail: {measurement}, bubbles: true, composed: true}));
    }
}

customElements.define("sla-measurement", SlaMeasurement);
