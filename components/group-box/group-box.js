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
    #toggleBtn;

    get html() { return import.meta.url.replace('.js', '.html') }

    // Required for testing
    get clickHandler() { return this.#clickHandler }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch(this.html).then(result => result.text());
        await this.#load()
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
            this.#toggleBtn = this.shadowRoot.querySelector('#btnToggleExpand');
        })
    }

    async disconnectedCallback() {
        this.shadowRoot.removeEventListener("click", this.#clickHandler);
        this.#clickHandler = null;
    }

    async #click(event) {
        const target = event.composedPath()[0];
        if (target.id === 'btnToggleExpand') {
            await this.#toggleExpanded();
        }
    }

    /**
     * @method toggleExpanded - toggle the expanded state of the group bo.
     * @returns {Promise<void>}
     */
    async #toggleExpanded() {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !expanded);
        const content = this.shadowRoot.querySelector('#main');
        this.#toggleBtn.classList.toggle('collapsed');
        if (expanded === true) {
            content.style.display = 'none';
            // this.shadowRoot.querySelector('#btnToggleExpand').innerHTML = "chevron-up";
            // this.#toggleBtn.classList.add('collapsed');
        }
        else {
            content.style.display = 'block';
            // this.shadowRoot.querySelector('#btnToggleExpand').innerHTML = "chevron-down";
            // this.#toggleBtn.classList.remove('collapsed');
        }
    }
}

customElements.define('group-box', GroupBox);