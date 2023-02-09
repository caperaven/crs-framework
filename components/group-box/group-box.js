/**
 * @class GroupBox - group box component
 *
 * Features:
 * 1. Allow custom header, content.
 * 2. Allow custom actions.
 * 3. Expand and collapse content.
 * 4. Container auto expands based on the content size.
 *
 * Content:
 * Content has default slot. If custom content
 *
 * Header:
 * The header can be defined in one of two ways.
 * 1. data-title attribute where you define the title text.
 * 2. Custom header element that has slot="header".
 *
 * Actions:
 * Actions are defined as a element with slot="actions".
 *
 * @example <caption>Simple</caption>
 * <group-box data-title="Hello World">
 *     <div>Content</div>
 * </group-box>
 *
 * @example <caption>Custom Header</caption>
 * <group-box data-title="hello world">
 *     <div slot="header">
 *         <icon>home</icon>
 *     </div>
 *     <div>Content</div>
 * </group-box>
 *
 * @example <caption>Custom Actions</caption>
 * <group-box>
 *    <div slot="header">
 *         <icon>home</icon>
 *     </div>
 *     <div slot="actions">
 *         <button>Click Me</button>
 *     </div>
 *     <div>Content</div>
 * </group-box>
 */
export class GroupBox extends HTMLElement {

    /**
     * Todo: @Andre
     * 1. Get the examples page up and running
     * 2. Do styling of the component
     * 3. Add the click events for the expand and collapse on btnToggleExpand.
     * 4. Write tests.
     * @returns {string}
     */

    #clickHandler = this.#click.bind(this);
    #headerKeyHandler = this.#headerKeyUp.bind(this);

    static get observedAttributes() {
        return ["data-title"];
    }

    get html() { return import.meta.url.replace('.js', '.html') }

    // Required for testing
    get clickHandler() { return this.#clickHandler }
    get headerKeyHandler() { return this.#headerKeyHandler }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch(this.html).then(result => result.text());
        await this.#load();
    }

    /**
     * @method load - load the component.
     * set up event listeners and set aria attributes.
     * @returns {Promise<void>}
     */
    async #load() {
        requestAnimationFrame(async () => {
            this.setAttribute("aria-expanded", "true");
            this.shadowRoot.addEventListener("click", this.#clickHandler);
            this.shadowRoot.querySelector("header").addEventListener("keyup", this.#headerKeyHandler);

            this.shadowRoot.querySelector("#title").textContent = this.dataset.title;
        });
    }

    async disconnectedCallback() {
        this.shadowRoot.removeEventListener("click", this.#clickHandler);
        this.shadowRoot.querySelector("header").removeEventListener("keyup", this.#headerKeyHandler);

        this.#clickHandler = null;
        this.#headerKeyHandler = null;
    }

    async #click(event) {
        const target = event.composedPath()[0];
        if (target.id === 'btnToggleExpand') {
            await this.#toggleExpanded();
        }
    }

    /**
     * @method headerKeyUp - handle key up events on the header.
     * This in particular handles the aria keyboard shortcuts to expand or collapse the group box.
     * Options:
     * 1. ArrowUp - collapse the group box.
     * 2. ArrowDown - expand the group box.
     * @param event {MouseEvent} - standard event
     * @returns {Promise<void>}
     */
    async #headerKeyUp(event) {
        // if you press any key other than up or down, ignore it and return;
        if (event.key !== "ArrowUp" && event.key !== "ArrowDown") {
            return;
        }

        // if you press up or down, toggle the expanded state.
        this.setAttribute('aria-expanded', event.key == "ArrowUp" ? "false" : "true");
    }

    /**
     * @method toggleExpanded - toggle the expanded state of the group bo.
     * @returns {Promise<void>}
     */
    async #toggleExpanded() {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !expanded);
    }

    /**
     * @method attributeChangedCallback - handle attribute changes.
     * In particular, we are looking for the data-title attribute.
     * If it changes, we update the title element.
     * @param name {string} - name of the attribute
     * @param oldValue {string} - old value of the attribute
     * @param newValue {string} - new value of the attribute
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data-title') {
            const titleElement = this.shadowRoot.querySelector("#title");
            if(titleElement != null) {
                titleElement.textContent = this.dataset.title;
            }
        }
    }
}

customElements.define('group-box', GroupBox);