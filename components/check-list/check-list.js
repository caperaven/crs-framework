/**
 * @class Checklist - A simple checklist container component
 * When working with a flat group of checkboxes, clicking on a list item will toggle the aria-checked attribute on that list item.
 * When working with a tri-state group of checkboxes:
 *  - Clicking on a list item with children will toggle the aria-checked attribute on that list item and all of its children.
 *  - When clicking on a child list item:
 *      - If all of the siblings are checked, then the parent will be checked.
 *      - If all of the siblings are unchecked, then the parent will be unchecked.
 *      - If some of the siblings are checked, then the parent will be in an indeterminate state.
 *
 * @example <caption>html use example of a flat checklist</caption>
 * <label id="two-state">&{checklist.label}</label>
 * <check-list ref="checklist" role="group" aria-labelledby="two-state">
 *     <li id="item1" role="checkbox" data-value="item1" aria-checked="true">&{checklist.item1}</li>
 *     <li id="item2" role="checkbox" data-value="item2">&{checklist.item2}</li>
 *     <li id="item3" role="checkbox" data-value="item3">&{checklist.item3}</li>
 *     <li id="item4" role="checkbox" data-value="item4" aria-checked="true">&{checklist.item4}</li>
 * </check-list>
 *
 * @example <caption>html use example of a tri-state checklist</caption>
 * <label id="tri-state">&{checklist.label}</label>
 * <check-list ref="checklist" role="group" aria-labelledby="tri-state">
 *      <ul id="item1" role="checkbox" data-value="item1" aria-checked='true' aria-controls="item2 item3" aria-labelledby="lbl-item1">
 *          <label id="lbl-item1">&{checklist.item1}<label>
 *          <li id="item2" role="checkbox" data-value="item2" aria-checked="true">&{checklist.item2}</li>
 *          <li id="item3" role="checkbox" data-value="item3" aria-checked="true">&{checklist.item3}</li>
 *     </ul>
 *     <ul id="item4" role="checkbox" data-value="item4" aria-checked='false' aria-controls="item5 item6" aria-labelledby="lbl-item4">
 *          <label id="lbl-item4">&{checklist.item4}<label>
 *          <li id="item5" role="checkbox" data-value="item5">&{checklist.item5}</li>
 *          <li id="item6" role="checkbox" data-value="item6">&{checklist.item6}</li>
 *     </ul>
 *      <ul id="item7" role="checkbox" data-value="item7" aria-checked='mixed' aria-controls="item8 item9" aria-labelledby="lbl-item7">
 *          <label id="lbl-item7">&{checklist.item7}<label>
 *          <li id="item8" role="checkbox" data-value="item8" aria-checked="true">&{checklist.item8}</li>
 *          <li id="item9" role="checkbox" data-value="item9">&{checklist.item9}</li>
 *     </ul>
 *     <ul id="item10" role="checkbox" data-value="item10" aria-checked='mixed' aria-controls="item11 item12" aria-labelledby="lbl-item10">
 *          <label id="lbl-item10">&{checklist.item10}<label>
 *          <ul id="item11" role="checkbox" data-value="item11" aria-checked='mixed' aria-controls="item13 item14" aria-labelledby="lbl-item11">
 *              <label id="lbl-item11">&{checklist.item11}<label>
 *              <li id="item13" role="checkbox" data-value="item13" aria-checked='true'>&{checklist.item13}</li>
 *              <li id="item14" role="checkbox" data-value="item14">&{checklist.item14}</li>
 *          </ul>
 *          <ul id="item12" role="checkbox" data-value="item12" aria-checked='true' aria-controls="item15 item16" aria-labelledby="lbl-item12">
 *              <label id="lbl-item12">&{checklist.item12}<label>
 *              <li id="item15" role="checkbox" data-value="item15" aria-checked='true'>&{checklist.item15}</li>
 *              <li id="item16" role="checkbox" data-value="item16" aria-checked='true'>&{checklist.item16}</li>
 *          </ul>
 *     </ul>
 * </check-list>
 *
 * @example <caption>html use example with items property</caption>
 * <check-list ref="checklist" role="group" items.bind="model.items">
 *     <template id="parent-item-template">
 *         <ul role="checkbox" data-value.bind="item.value" aria-checked.bind="item.checked" aria-controls="" aria-labelledby.attr="lbl-${item.value}">
 *             <label id.attr="lbl-${item.value}">${item.text}<label>
 *         </ul>
 *     </template>
 *     <template id="child-item-template">
 *         <li role="checkbox" data-value.bind="value" aria-checked.bind="checked">${item.text}</li>
 *     </template>
 * </check-list>
 *
 * @todo - JHR:
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

    //TODO KR: This is going to change quite significantly. Need to toggle aria-checked on selected item, and manage parents aria-checked state.
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