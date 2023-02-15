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
    #at;
    #anchor;
    #target;
    #clickHandler;
    #context;
    #process;
    #item;
    #margin;

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

    set at(newValue) {
        this.#at = newValue
    }

    set anchor(newValue) {
        this.#anchor = newValue;
    }

    set target(newValue) {
        this.#target = newValue;
    }

    set margin(newValue) {
        this.#margin = newValue;
    }

    set height(newValue) {
        if (typeof newValue == "number") {
            newValue = `${newValue}px`
        }

        this.style.setProperty("--height", newValue);
    }

    async connectedCallback() {
        return new Promise(async (resolve) => {
            await super.connectedCallback();

            this.#clickHandler = this.click.bind(this);
            this.shadowRoot.addEventListener("click", this.#clickHandler);

            await crsbinding.translations.add({
                approved: "Approved"
            })

            requestAnimationFrame(async () => {
                const ul = this.shadowRoot.querySelector(".popup");

                await this.#buildElements();

                let at = "right";
                let anchor = "top";

                if (this.#target) {
                    at = "bottom";
                    anchor = "left";
                }

                await crs.call("fixed_layout", "set", {
                    element: ul,
                    target: this.#target,
                    point: this.#point,
                    at: this.#at || at,
                    anchor: this.#anchor || anchor,
                    margin: this.#margin || 0
                })

                await crs.call("dom_interactive", "enable_resize", {
                    element: this.popup,
                    resize_query: "#resize",
                    options: {}
                });

                await crs.call("component", "notify_ready", {element: this});
                resolve();
            })
        });
    }

    async disconnectedCallback() {
        this.removeEventListener("click", this.#clickHandler);
        this.#clickHandler = null;
        this.#options = null;
        this.#point = null;
        this.#at = null;
        this.#anchor = null;
        this.#target = null;
        this.#context = null;
        this.#process = null;
        this.#item = null;
        this.#margin = null;
    }

    #optionById(id) {
        const item = this.#options.find(item => item.id == id);
        return item;
    }

    async #buildElements() {
        const fragment = document.createDocumentFragment();

        await createListItems(fragment, this.#options, this.templates);

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

        const li = await crs.call("dom_utils", "find_parent_of_type", {
            element: event.target,
            nodeName: "li",
            stopAtNodeName: "ul"
        });

        if (li == null) return;

        const option = this.#optionById(li.id);

        if (option.type != null) {
            crs.call(option.type, option.action, option.args);
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

async function createListItems(parentElement, collection, templates) {
    for (const option of collection) {
        if (option.title?.trim() == "-") {
            parentElement.appendChild(document.createElement("hr"));
            continue;
        }

        const li = await crs.call("dom", "create_element", {
            parent: parentElement,
            id: option.id,
            tag_name: "li",
            dataset: {
                icon: option.icon,
                ic: option.icon_color || "black",
                tags: option.tags || "",
                ...(option.dataset || {})
            },
            attributes: {
                role: "menuitem",
                "aria-selected": option.selected == true,
                ...(option.attributes || {})
            },
            styles: option.styles,
            variables: {
                "--cl-icon": option.icon_color || "black"
            }
        });

        if (option.template != null) {
            const template = templates[option.template];
            const fragment = await crs.call("html", "create", {
                ctx: option,
                html: template
            });
            li.appendChild(fragment);
        }
        else {
            if (option.children == null) {
                li.textContent = option.title;
            }
            else {
                await crs.call("dom", "create_element", {
                    parent: li,
                    tag_name: "div",
                    text_content: option.title
                });

                const ul = await crs.call("dom", "create_element", {
                    parent: li,
                    tag_name: "ul"
                });

                await createListItems(ul, option.children, templates);
            }
        }
    }
}

customElements.define("context-menu", ContextMenu);