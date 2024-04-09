import { loadHTML } from "../../../src/load-resources.js";

export class SlaMeasurement extends crs.classes.BindableElement {

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

                this.dataset.status = "loading";
                this.dispatchEvent(new CustomEvent("loading-measurement"));
                resolve();
            });
        });
    }
}

customElements.define("sla-measurement", SlaMeasurement);
