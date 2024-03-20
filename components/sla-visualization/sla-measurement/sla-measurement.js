import { loadHTML } from "../../../src/load-resources.js";

export class SlaMeasurement extends crs.classes.BindableElement {
    static get observedAttributes() {
        return ['data-progress']; // Watch for changes in data-progress attribute
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await loadHTML(import.meta.url);
        await this.load();
        await crs.call("component", "notify_ready", { element: this });
    }

    async load() {
        return new Promise(resolve => {
            requestAnimationFrame(async () => {
                console.log("the sla-measurement element is loaded");
                // await this.test();
                resolve();
            });
        });
    }

    async updateProgress() {
        // Wait for elements to be rendered
        await new Promise(resolve => requestAnimationFrame(resolve));

        const measurementContainer = this.shadowRoot.getElementById('mes-1');
        const progressBar = this.shadowRoot.querySelector('.progress-bar');
        const progressBarSpan = this.shadowRoot.querySelector('.progress-bar span');
        const dataProgress = this.getAttribute('data-progress');

        progressBar.style.height = dataProgress + '%'; // Set the height
        progressBarSpan.innerText = dataProgress + '%';
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data-progress') {
            this.updateProgress(); // Update on attribute change
        }
    }
}

customElements.define("sla-measurement", SlaMeasurement);
