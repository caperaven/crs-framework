/**
 * @class BusyUi - a custom element that displays a data table
 *
 * Events:
 * - ready - fired when the element is ready to be used from outside
 *
 * Attributes:
 * - data-message - the text to show in the component
 *
 * Methods:
 * - refresh - refresh the component from the data
 *
 * @example <caption>html example</caption>
 * <busy-ui data-message="hello world"></busy-ui>
 */
export class BusyUi extends HTMLElement {
    /**
     * @method observedAttributes - the attributes to watch for changes
     * @return {[string]}
     */
    static get observedAttributes() {
        return ['data-progress'];
    }

    /**
     * @constructor
     */
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    /**
     * @method connectedCallback - called when the element is added to the DOM
     * @returns {Promise<void>}
     */
    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(response => response.text());
        await this.load();
        await crs.call("component", "notify_ready", { element: this });
    }

    /**
     * @method load - load resources and attach event listeners
     * @returns {Promise<unknown>}
     */
    load() {
        return new Promise(resolve => {
            requestAnimationFrame(async () => {
                // load resources
                this.shadowRoot.querySelector("#lblMessage").innerText = this.dataset.message;
                this.shadowRoot.querySelector("#lblProgress").innerText = this.dataset.progress;
                resolve();
            });
        })
    }

    /**
     * @method attributeChangedCallback - called when an attribute changes
     * @return {Promise<void>}
     */
    async attributeChangedCallback(name, newVal, oldVal) {
        const lblMessage = this.shadowRoot.querySelector("#lblMessage");
        const lblProgress = this.shadowRoot.querySelector("#lblProgress");
        if (lblMessage != null) {
            lblMessage.innerText = this.dataset.message;
        }
        if (lblProgress != null) {
            lblProgress.innerText = this.dataset.progress;
        }
    }

}

customElements.define("busy-ui", BusyUi);