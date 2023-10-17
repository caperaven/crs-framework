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
 */
class ComboBox extends crs.classes.BindableElement {
    #template;
    #items;
    #busy;
    #options;

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
        this.#buildOptionsFromItems().catch(error => console.error(error));
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
                // 2. build the options from the items if they exist
                await this.#buildOptionsFromItems();

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

        for (const item of this.#items) {
            const option = document.createElement("option");
            option.value = item.value;
            option.innerText = item.text;
            fragment.appendChild(option);
        }

        const ul = this.shadowRoot.querySelector("ul");
        ul.innerHTML = "";
        ul.appendChild(fragment);
    }

    async select(event) {
        this.#busy = true;
        try {
            const selected = event.composedPath()[0];

            if (selected.nodeName !== "OPTION") return;

            this.value = selected.value;
            await this.setProperty("searchText", selected.textContent);

            this.shadowRoot.dispatchEvent(new CustomEvent("change", {detail: { value: this.value }, composed: true}));

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
        this.#options ||= Array.from(this.shadowRoot.querySelectorAll("option"));

        const input = event.composedPath()[0];
        const value = input.value;

        for (const option of this.#options) {
            option.classList.add("hidden");

            if (option.textContent.toLowerCase().indexOf(value.toLowerCase()) != -1) {
                option.classList.remove("hidden");
            }
        }

        const ul = this.shadowRoot.querySelector("ul");
        if (ul.classList.contains("hide")) {
            ul.classList.remove("hide");
        }
    }
}

customElements.define('combo-box', ComboBox)