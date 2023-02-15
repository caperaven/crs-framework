/**
 * @class Checklist - A simple checklist container component
 * clicking on a list item will toggle the aria-selected attribute on that list item
 *
 * @example <caption>html use example</caption>
 * <check-list ref="checklist">
 *     <li role="option" data-value="item1" aria-selected="true">&{checklist.item1}</li>
 *     <li role="option" data-value="item2">&{checklist.item2}</li>
 *     <li role="option" data-value="item3">&{checklist.item3}</li>
 *     <li role="option" data-value="item4" aria-selected="true">&{checklist.item4}</li>
 * </check-list>
 *
 * @todo JHR
 * - add tests
 */
export class Checklist extends HTMLElement {
    #clickHandler = this.#clicked.bind(this);

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    /**
     * @constructor
     */
    constructor() {
        super();
        this.attachShadow({mode:"open"});
    }

    /**
     * @method connectedCallback - called when the element is added to the DOM
     * @returns {Promise<void>}
     */
    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch(this.html).then(result => result.text());
        await this.load();
    }

    /**
     * @method load - called when the element is added to the DOM to initialize the component
     * @returns {Promise<void>}
     */
    async load() {
        requestAnimationFrame(async () => {
            this.setAttribute("role", "listbox");
            await crsbinding.translations.parseElement(this);
            this.shadowRoot.addEventListener("click", this.#clickHandler);
        })
    }

    /**
     * @method disconnectedCallback - called when the element is removed from the DOM
     * @returns {Promise<void>}
     */
    async disconnectedCallback() {
        await this.shadowRoot.removeEventListener("click",this.#clickHandler);
        this.#clickHandler = null;
    }

    /**
     * @method #clicked - called when a list item is clicked
     * @param event
     * @returns {Promise<void>}
     */
    async #clicked(event) {
        const target = event.composedPath()[0];
        await crs.call("dom_collection", "toggle_selection", {target: target, multiple: true});
        this.dispatchEvent(new CustomEvent('selection-changed', {detail: {value: target.dataset.value, selected: target.getAttribute("aria-selected") == "true"}}));
    }
}

customElements.define("check-list", Checklist);