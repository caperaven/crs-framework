import {loadHTML} from "./../../src/load-resources.js";

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

        /**
         * TODO: Andre. add the attribute update code and add the ... animation stuff.
         */


        this.shadowRoot.innerHTML = await loadHTML(import.meta.url);
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
                resolve();
            });
        })
    }
}

customElements.define("busy-ui", BusyUi);