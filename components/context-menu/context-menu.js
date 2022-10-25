import "./../filter-header/filter-header.js";

/**
 * Todo:
 * 1. add expand
 * 2. add sub item support
 * 3. add keyboard support
 */


class ContextMenu extends crsbinding.classes.BindableElement {
    #options;
    #point;
    #clickHandler;
    #context;
    #process;
    #item;

    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    set options(newValue) {
        this.#options = newValue;
    }

    set point(newValue) {
        this.#point = newValue;
    }

    set context(newValue) {
        this.#context = newValue;
    }

    async connectedCallback() {
        await super.connectedCallback();

        this.#clickHandler = this.click.bind(this);
        this.shadowRoot.addEventListener("click", this.#clickHandler);

        await crsbinding.translations.add({
            approved: "Approved"
        })

        requestAnimationFrame(async () => {
            const ul = this.shadowRoot.querySelector(".popup");

            await this.#buildElements();

            await crs.call("fixed_layout", "set", {
                element: ul,
                point: this.#point,
                at: "right",
                anchor: "top",
            })

            await crs.call("dom_interactive", "enable_resize", {
                element: this.popup,
                resize_query: "#resize",
                options: {}
            })
        })
    }

    async disconnectedCallback() {
        this.removeEventListener("click", this.#clickHandler);
        this.#clickHandler = null;
        this.#options = null;
        this.#point = null;
        this.#context = null;
        this.#process = null;
        this.#item = null;
    }

    #optionById(id) {
        const item = this.#options.find(item => item.id == id);
        return item;
    }

    async #buildElements() {
        const fragment = document.createDocumentFragment();

        for (const option of this.#options) {
            if (option.title.trim() == "-") {
                fragment.appendChild(document.createElement("hr"));
            }
            else {
                await crs.call("dom", "create_element", {
                    parent: fragment,
                    id: option.id,
                    tag_name: "li",
                    dataset: {
                        icon: option.icon,
                        tags: option.tags || "",
                        ...(option.dataset || {})
                    },
                    attributes: {
                        role: "menuitem",
                        ...(option.attributes || {})
                    },
                    styles: option.styles,
                    text_content: option.title
                })
            }
        }

        this.container.innerHTML = "";
        this.container.appendChild(fragment);

        if (this.#context) {
            await crsbinding.staticInflationManager.inflateElements(this.container.children, this.#context);
        }
    }

    async click(event) {
        if (event.target.matches(".back")) {
            return await this.close();
        }

        if (event.target.nodeName != 'LI') {
            return;
        }

        const option = this.#optionById(event.target.id);

        if (option.type != null) {
            await crs.call(option.type, option.action, option.args);
        }

        this.dataset.value = option.id;
        this.dispatchEvent(new CustomEvent("change", {detail: option.id}));

        await this.close();
    }

    async close() {
        await crs.call("context_menu", "close");
    }

    async focus() {
        // console.log("focus first");
    }
}

customElements.define("context-menu", ContextMenu);