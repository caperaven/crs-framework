/**
 * @class ComboBox - combobox component with custom features.
 *
 * @example <caption>html usage</caption>
 * <combo-box>
 *     <option value="1">Option 1</option>
 *     <option value="2">Option 2</option>
 *     <option value="3">Option 3</option>
 * </combo-box>
 *
 * @example <caption>html usage with items property</caption>
 * <combo-box items.bind="model.options>
 *     <template>
 *         <option value.attr="item.value">${item.text}</option>
 *     </template>
 * </combo-box>
 */
class ComboBox extends HTMLElement {
    #clickHandler = this.#click.bind(this);

    // public for testability
    get clickHandler() {
        return this.#clickHandler;
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(response => response.text());
        await this.load();
    }

    load() {
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                this.#toggleExpanded(true);
                this.shadowRoot.addEventListener("click", this.#clickHandler);
                // put your events and element pointers here.
                resolve();
            })
        })
    }

    async disconnectedCallback() {
        this.shadowRoot.removeEventListener("click", this.#clickHandler);
    }

    /**
     * @method toggleExpanded - toggles the expanded state of the combobox.
     * @param {boolean} isExpanded - should the component be seen as expanded. This is used to force the state.
     */
    #toggleExpanded(isExpanded) {
        const expanded = isExpanded === true || this.getAttribute("aria-expanded") === "true";
        this.setAttribute("aria-expanded", !expanded);
        this.shadowRoot.querySelector("#btnDropdown").setAttribute("aria-expanded", !expanded);
    }

    /**
     * @method click - handles click events on the combobox.
     * @param event {Event} - the mouse click event.
     * @returns {Promise<void>}
     */
    async #click(event) {
        const target = event.composedPath()[0];
        if (target.id === "btnDropdown") {
            await this.#toggleExpanded();
        }
    }
}

customElements.define('combo-box', ComboBox)