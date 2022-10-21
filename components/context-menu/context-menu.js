import "./../filter-header/filter-header.js";

class ContextMenu extends crsbinding.classes.BindableElement {
    #options;
    #point;
    #clickHandler;

    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get options() {
        return this.#options;
    }

    set options(newValue) {
        this.#options = newValue;
    }

    get point() {
        return this.#point;
    }

    set point(newValue) {
        this.#point = newValue;
    }

    async connectedCallback() {
        await super.connectedCallback();

        this.#clickHandler = this.click.bind(this);
        this.shadowRoot.addEventListener("click", this.#clickHandler);

        requestAnimationFrame(async () => {
            const ul = this.shadowRoot.querySelector(".popup");

            await this.#buildElements();

            await crs.call("fixed_layout", "set", {
                element: ul,
                point: this.#point,
                at: "right",
                anchor: "top",
            })
        })
    }

    async disconnectedCallback() {
        this.removeEventListener("click", this.#clickHandler);
        this.#clickHandler = null;
        this.#options = null;
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
                        tags: option.title.toLowerCase()
                    },
                    attributes: {
                        role: "menuitem"
                    },
                    text_content: option.title
                })
            }
        }

        this.container.innerHTML = "";
        this.container.appendChild(fragment);
    }

    async click(event) {
        if (event.target.nodeName == 'FILTER-HEADER') {
            return;
        }

        if (event.target.matches(".back")) {
            return await this.close();
        }

        const option = this.#optionById(event.target.id);
        await crs.call(option.type, option.action, option.args);
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