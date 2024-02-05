const LOADING = "loading";

/**
 * @class ComboBox - combobox component with custom features.
 *
 * @example <caption>html usage</caption>
 * <combo-box>®
 *     <li value="1">Option 1</li>
 *     <li value="2">li 2</li>
 *     <li value="3">li 3</li>
 * </combo-box>
 *
 * @example <caption>html usage with items property</caption>
 * <combo-box items.bind="model.options">
 *     <template>
 *         <option value.attr="item.value">${item.text}</option>
 *     </template>
 * </combo-box>
 *
 * NOTE: keep in mind that when you already declare the options in the HTML, internally it does the following:
 * 1. creates the items data from those options.
 * 2. creates options to be used in the lookup UL from the item data.
 * 3. deletes the original items as they are no longer used.
 */
class ComboBox extends crs.classes.BindableElement {
    #template;
    #items;
    #busy;
    #options;
    #ul;
    #isOpen = false;
    #highlighted;
    #currentValue = null;

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    get items() {
        return this.#items;
    }

    set items(value) {
        this.#items = value;
        if (Array.isArray(value)) {
            this.#buildOptionsFromItems().catch(error => console.error(error));
        }
    }

    get value() {
        return this.getProperty("value");
    }

    set value(newValue) {
        if (newValue === "") newValue = null;

        this.setProperty("value", newValue);

        if (this.#busy !== true) {
            this.#setTextFromValue(newValue);
        }
    }

    get text() {
        return this.getProperty("searchText");
    }

    /**
     * @method connectedCallback - called when the component is added to the dom.
     * There are two basic parts that must always be in place for this to work.\
     * 1. Items data that determines the list items.
     * 2. Template that determines how the items are rendered.
     *
     * Thought there are two different ways as seen above on how to define the items,
     * they both apply as items data and template.
     * If the light dom does not have a template the default will be used.
     * If the light dom defines options they will be used as items data.
     * @returns {Promise<void>}
     */
    async connectedCallback() {
        this.#busy = LOADING;
        // 1. load template from light dom of it exists
        this.#template = this.querySelector("template");
        // 2. load items from light dom if they exist
        await this.#loadItemsFromDom();
        // 3. continue with default processing
        await super.connectedCallback();
    }

    load() {
        return new Promise(resolve => {
            requestAnimationFrame(async () => {
                this.setAttribute("tabindex", "0");
                this.setAttribute("aria-expanded", "false");
                this.dataset.default ||= "";

                // 1. if no template was loaded you are working with
                // data that will flow in from the outside so use the default template in the component
                this.#template ||= this.shadowRoot.querySelector("#tplDefaultItem");
                this.#template.remove();
                this.#ul = this.shadowRoot.querySelector("ul");

                // 2. build the options from the items if they exist
                if (Array.isArray(this.#items)) {
                    await this.#buildOptionsFromItems();
                }

                this.#busy = false;
                const value = this.getProperty("value");
                this.#setTextFromValue(value);

                const input = this.shadowRoot.querySelector("input");
                input.placeholder = this.getAttribute("placeholder") ?? "";

                if (this.hasAttribute("required") === true) {
                    input.setAttribute("required", "required");
                }

                // this is already called in the base class so we don't want to call it again.
                // await crs.call("component", "notify_ready", { element: this });
                resolve();
            })
        })
    }

    async disconnectedCallback() {
        this.#template = null;
        this.#ul = null;
        this.#items = null;
        this.#options = null;
        this.#busy = null;
        this.#highlighted = null;
        this.#currentValue = null;

        super.disconnectedCallback();
    }

    /**
     * @method #setTextFromValue - sets the text from the value by looking at the text content of the options
     * @param value
     */
    #setTextFromValue(value) {
        if (this.#busy === LOADING) return;

        // There is no value check for default values and use that if required
        if ((value ?? "").toString().trim().length === 0) {
            const defaultOption = this.#ul.querySelector(`li[data-value='${this.dataset.default}']`);
            this.select(null, defaultOption).catch(error => console.error(error));
        }

        // There is a value so use that to set the text
        const options = Array.from(this.shadowRoot.querySelectorAll("li"));
        const selected = options.find(option => option.dataset.value == value);

        if (selected != null) {
            this.setProperty("searchText", selected.textContent);
        }
    }

    /**
     * @method #loadItemsFromDom - loads the items from the light dom if they exist.
     * This will search for option elements and build an array of items from them.
     * @returns {Promise<void>}
     */
    async #loadItemsFromDom() {
        const options = this.querySelectorAll("li");

        if (options.length > 0) {
            this.#items = Array.from(options).map(option => {
                return {
                    value: option.dataset.value,
                    text: option.textContent
                }
            })
        }

        this.innerHTML = "";
    }

    /**
     * @method #buildOptionsFromItems - builds the options from the items.
     * @returns {Promise<void>}
     */
    async #buildOptionsFromItems() {
        if (this.#items == null) return;
        this.#options = null;

        const fragment = document.createDocumentFragment();

        if (this.#template != null) {
            await this.#buildItemsFromTemplate(fragment)
        }
        else {
            await this.#buildItemsManually(fragment);
        }

        const ul = this.shadowRoot.querySelector("ul");
        ul.innerHTML = "";
        ul.appendChild(fragment);

        this.#setTextFromValue(this.value);
    }

    async #buildItemsFromTemplate(fragment) {
        for (const item of this.#items) {
            const instance = this.#template.content.cloneNode(true);
            const option = instance.firstElementChild;
            await crs.binding.staticInflationManager.inflateElement(option, item);
            fragment.appendChild(option);
        }
    }

    async #buildItemsManually(fragment) {
        for (const item of this.#items) {
            const option = document.createElement("li");
            option.dataset.value = item.value;
            option.textContent = item.text;

            if (item.disabled === true) {
                option.setAttribute("disabled", "disabled");
            }

            fragment.appendChild(option);
        }
    }

    async #highlightNext() {
        requestAnimationFrame(async () => {
            await this.showOptions();

            this.#highlighted = this.#ul.querySelector(".highlighted");
            if (this.#highlighted == null) {
                this.#highlighted = this.#ul.firstElementChild;
                return this.#highlighted?.classList.add("highlighted");
            }

            let next = this.#highlighted.nextElementSibling;
            if (next == null) {
                next = this.#ul.firstElementChild;
            }

            this.#highlighted.classList.remove("highlighted");
            next.classList.add("highlighted");
            this.#highlighted = next;

            if (next.classList.contains("hidden") === true) {
                return await this.#highlightNext();
            }
        });
    }

    async #highlightPrevious() {
        requestAnimationFrame(async () => {
            await this.showOptions();

            const currentHighlighted = this.#ul.querySelector(".highlighted");
            if (currentHighlighted == null) {
                return this.#ul.lastElementChild.classList.add("highlighted");
            }

            let next = currentHighlighted.previousElementSibling;
            if (next == null) {
                next = this.#ul.lastElementChild;
            }

            currentHighlighted.classList.remove("highlighted");
            next.classList.add("highlighted");

            if (next.classList.contains("hidden") === true) {
                return await this.#highlightPrevious();
            }
        })
    }

    async showOptions(isVisible = true) {
        this.#currentValue = this.value;

        if (Boolean(isVisible) === true) {
            this.#isOpen = true;
            if (this.#ul.classList.contains("hide") === true) {
                await this.#setAriaSelected();
                return this.#ul.classList.remove("hide");
            }
        }
        else {
            this.#currentValue = null;
            this.#isOpen = false;
            if (this.#ul.classList.contains("hide") === false) {
                return this.#ul.classList.add("hide");
            }
        }
    }

    async #setAriaSelected() {
        const value = this.getProperty("value");
        const selected = this.#ul.querySelector("[aria-selected]");

        if (selected != null) {
            selected.removeAttribute("aria-selected");
        }

        const new_selected = this.#ul.querySelector(`[data-value="${value}"]`);

        if (new_selected != null) {
            new_selected.setAttribute("aria-selected", "true");
        }
    }

    async #selectCurrent() {
        const currentHighlighted = this.#ul.querySelector(".highlighted");
        if (currentHighlighted == null) return;

        await this.select(null, currentHighlighted)
    }

    async select(event, highlighted) {
        // There is no selection as it has been cleared.
        if (event == null && highlighted == null) {
            await this.setProperty("value", null);
            await this.setProperty("searchText", "");
            return;
        }

        this.#busy = true;
        try {
            const selected = highlighted || event.composedPath()[0];

            if (selected.nodeName !== "LI" || selected.dataset.value == null) return;

            await this.setProperty("value", selected.dataset.value);
            await this.setProperty("searchText", selected.textContent);

            this.shadowRoot.dispatchEvent(new CustomEvent("change", {detail: { componentProperty: "value" }, composed: true}));

            await this.showOptions(false);

            if (this.#options != null) {
                for (const option of this.#options) {
                    option.classList.remove("hidden");
                }
            }
        }
        finally {
            this.#busy = false;
        }
    }

    async search(event) {
        if (event.key === "Tab") return;

        if (event.key === "ArrowDown") {
            return await this.#highlightNext();
        }

        if (event.key === "ArrowUp") {
            return await this.#highlightPrevious();
        }

        if (event.key === "Enter") {
            if (this.#isOpen === true) {
                return await this.#selectCurrent();
            }
            else {
                return await this.showOptions(true);
            }
        }

        if (event.key === "Escape") {
            // JHR: cancel the lookup if open.
            if (this.#isOpen === true) {
                this.value = this.#currentValue;
                return await this.showOptions(false);
            }
        }

        this.#options ||= Array.from(this.shadowRoot.querySelectorAll("li"));

        const input = event.composedPath()[0];
        const value = input.value;

        // remove the current highlighted item
        this.#highlighted?.classList.remove("highlighted");

        for (const option of this.#options) {
            option.classList.add("hidden");

            if (option.textContent.toLowerCase().indexOf(value.toLowerCase()) != -1) {
                option.classList.remove("hidden");
            }
        }

        // highlight the first visible item
        this.#highlighted = this.#ul.querySelector("li:not(.hidden)");
        this.#highlighted.classList.add("highlighted");
ß
        await this.showOptions();
    }

    async clear() {
        this.value = "";

        await this.setProperty("value", null);
        this.shadowRoot.dispatchEvent(new CustomEvent("change", {detail: { componentProperty: "value" }, composed: true}));
    }

    async valueChanged(value) {
        const button = this.shadowRoot.querySelector("#btnClear");
        button.setAttribute("hidden", "hidden");

        value = (value ?? "").toString().trim();

        const hasValue = value.length > 0;
        const isDefault = value === this.dataset.default;

        if (hasValue === true && isDefault === false    ) {
            button.removeAttribute("hidden");
        }
    }
}

customElements.define('combo-box', ComboBox)