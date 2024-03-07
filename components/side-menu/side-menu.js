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
    #clickHandler = this.#click.bind(this);

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
                this.shadowRoot.addEventListener("click", this.#clickHandler);

                this.sideMenuContentPanel = this.shadowRoot.querySelector('#side-menu-content-panel');
            });
        })
    }

    /**
     * @method disconnectedCallback - called when the element is removed from the DOM
     * @returns {Promise<void>}
     */
    async disconnectedCallback() {
        // dispose of resources
        this.shadowRoot.removeEventListener("click", this.#clickHandler);
        this.#clickHandler = null;
        this.sideMenuContentPanel = null;
    }

    /**
     * @method click- click event handler for the side menu.
     * @returns {Promise<void>}
     */
    async #click(event) {
        console.log("click", event.composedPath()[0]);
        let target = event.composedPath()[0];
        if (target.tagName === 'DIV' && target.getAttribute('role') === 'button') {
            console.log('Clicked on a div with role button');
            await this.openSideMenu();
        }
    }

    // ToDo: AW - Think about having a toggleOpen method that toggles the open state of the side menu
    /**
     * @method openSideMenu - opens the side menu
     * @return {Promise<void>}
     */
    async openSideMenu() {
        console.log('Opening the side menu');
        this.sideMenuContentPanel.classList.toggle("slide-out")
    }
}

customElements.define("side-menu", SideMenu);