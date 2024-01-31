const LOADING = "loading";

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
        this.setProperty("value", newValue);

        if (this.#busy != true  ) {
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
                this.setAttribute("aria-expanded", "false");
                // 1. if no template was loaded you are working with
                // data that will flow in from the outside so use the default template in the component
                this.#template ||= this.shadowRoot.querySelector("#tplDefaultItem");
                this.#ul = this.shadowRoot.querySelector("ul");

                // 2. build the options from the items if they exist
                if (Array.isArray(this.#items)) {
                    await this.#buildOptionsFromItems();
                }

                this.#busy = false;
                const value = this.getProperty("value");
                this.#setTextFromValue(value);

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

        super.disconnectedCallback();
    }

    #setTextFromValue(value) {
        if (this.#busy === LOADING) return;

        if (value == null) {
            value = "";
        }

        if ((value.toString() ?? "").trim().length == 0) {
            return this.setProperty("searchText", "");
        }

        const options = Array.from(this.shadowRoot.querySelectorAll("option"));
        const selected = options.find(option => option.value == value);

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
        const options = this.querySelectorAll("option");

        if (options.length > 0) {
            this.#items = Array.from(options).map(option => {
                return {
                    value: option.value,
                    text: option.innerText
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
            const option = document.createElement("option");
            option.value = item.value;
            option.innerText = item.text;
            fragment.appendChild(option);
        }
    }

    async #highlightNext() {
        await this.#showOptions();

        const currentHighlighted = this.#ul.querySelector(".highlighted");
        if (currentHighlighted == null) {
            return this.#ul.firstElementChild.classList.add("highlighted");
        }

        let next = currentHighlighted.nextElementSibling;
        if (next == null) {
            next = this.#ul.firstElementChild;
        }

        currentHighlighted.classList.remove("highlighted");
        next.classList.add("highlighted");

        if (next.classList.contains("hidden") === true) {
            return await this.#highlightNext();
        }
    }

    async #highlightPrevious() {
        await this.#showOptions();

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
    }

    async #showOptions(isVisible = true) {
        if (isVisible === true) {
            this.#isOpen = true;
            if (this.#ul.classList.contains("hide") === true) {
                return this.#ul.classList.remove("hide");
            }
        }
        else {
            this.#isOpen = false;
            if (this.#ul.classList.contains("hide") === false) {
                return this.#ul.classList.add("hide");
            }
        }
    }

    async #selectCurrent() {
        const currentHighlighted = this.#ul.querySelector(".highlighted");
        if (currentHighlighted == null) return;

        await this.select(null, currentHighlighted)
    }

    async select(event, highlighted) {
        this.#busy = true;
        try {
            const selected = highlighted || event.composedPath()[0];

            if (selected.nodeName !== "OPTION") return;

            this.value = selected.value;
            await this.setProperty("searchText", selected.textContent);

            this.shadowRoot.dispatchEvent(new CustomEvent("change", {detail: { componentProperty: "value" }, composed: true}));

            await this.#showOptions(false);

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
                return await this.#showOptions(true);
            }
        }

        this.#options ||= Array.from(this.shadowRoot.querySelectorAll("option"));

        const input = event.composedPath()[0];
        const value = input.value;

        for (const option of this.#options) {
            option.classList.add("hidden");

            if (option.textContent.toLowerCase().indexOf(value.toLowerCase()) != -1) {
                option.classList.remove("hidden");
            }
        }

        await this.#showOptions();
    }
}

customElements.define('combo-box', ComboBox)