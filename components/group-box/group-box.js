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
    get html() { return import.meta.url.replace('.js', '.html') }

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
        })
    }

    /**
     * @method toggleExpanded - toggle the expanded state of the group bo.
     * @returns {Promise<void>}
     */
    async #toggleExpanded() {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        expanded.setAttribute('aria-expanded', !expanded);
    }

    async disconnectedCallback() {

    }
}

customElements.define('group-box', GroupBox);