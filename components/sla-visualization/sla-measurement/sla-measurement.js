import { loadHTML } from "../../../src/load-resources.js";

export class SlaMeasurement extends crs.classes.BindableElement {
    #clickHandler = this.#click.bind(this);

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await loadHTML(import.meta.url);
        await this.load();
    }

    async load() {
        return new Promise(resolve => {
            requestAnimationFrame(async () => {
                console.log("the sla-measurement element is loaded");
                this.shadowRoot.addEventListener("click", this.#clickHandler);

                await crs.call("component", "notify_ready", { element: this });
                resolve();
            });
        });
    }

    async disconnectedCallback() {
        this.shadowRoot.removeEventListener("click", this.#clickHandler);
        this.#clickHandler = null;
    }

    async #click(event) {
        console.log("click event", event);
    }

    async updateProgress() {
        // Get the progress value from the data-progress attribute
    }
}

customElements.define("sla-measurement", SlaMeasurement);
