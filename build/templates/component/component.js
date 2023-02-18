/**
 * @class __class__ - a custom element that displays a data table
 *
 * Properties:
 * - value {*} - value of component
 *
 * Events:
 * - ready - fired when the element is ready to be used from outside
 * - change - fired when the value changes
 *
 * Attributes:
 * - data-something - some attribute
 *
 * Methods:
 * - refresh - refresh the component from the data
 *
 * @example <caption>html example</caption>
 * <my-component></my-component>
 */
export class __class__ extends HTMLElement {
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
                resolve();
            });
        })
    }

    /**
     * @method disconnectedCallback - called when the element is removed from the DOM
     * @returns {Promise<void>}
     */
    async disconnectedCallback() {
        // dispose of resources
    }
}

customElements.define("__element__", __class__);