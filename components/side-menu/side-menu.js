import {loadHTML} from "./../../src/load-resources.js";

/**
 * @class SideMenu - a custom element that displays a data table
 *
 * Properties:
 * - isOpen - true if the side menu is open
 *
 * Events:
 * - ready - fired when the element is ready to be used from outside
 *
 * Attributes:
 * - data-is-open - true if the side menu is open
 *
 * Methods:
 * - openSideMenu - opens the side menu
 *
 * @example <caption>html example</caption>
 * <side-menu></side-menu>
 */
export class SideMenu extends HTMLElement {
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

customElements.define("side-menu", SideMenu);