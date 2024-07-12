import "./../../context-menu/context-menu-actions.js";

class SlaMeasurement extends HTMLElement {
    #mouseEnterHandler = this.#mouseEnter.bind(this);
    #mouseLeaveHandler = this.#mouseLeave.bind(this);

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
        this.#mouseEnterHandler = null;
        this.#mouseLeaveHandler = null;
    }

    async #mouseEnter(event) {
        await this.#dispatchCustomPopupEvent(this);
    }

    async #mouseLeave(event) {
        await this.#dispatchCustomPopupEvent();
    }

    async #dispatchCustomPopupEvent(measurement = null) {
        this.dispatchEvent(new CustomEvent("measurement-hovered", {detail: {measurement}, bubbles: true, composed: true}));
    }
}

customElements.define("sla-measurement", SlaMeasurement);
