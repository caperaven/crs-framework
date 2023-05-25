import "./../filter-header/filter-header.js";

/**
 * @class ContextMenu - A context menu component that can be used to display a list of options.
 * This can either be a flat list or a nested list.
 * You should not be using this component directly but instead use the context_menu process api action instead.
 */
class ContextMenu extends crs.classes.BindableElement {
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
    #templates;
    #filterCloseHandler = this.#filterClose.bind(this);
    #filterFocusOutHandler = this.#filterFocusOut.bind(this);
    #filterHeader;

    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async connectedCallback() {
        return new Promise(async (resolve) => {
            await super.connectedCallback();

            this.#clickHandler = this.#click.bind(this);
            this.shadowRoot.addEventListener("click", this.#clickHandler);

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

                this.#filterHeader = this.shadowRoot.querySelector("filter-header");
                this.#filterHeader.addEventListener("close", this.#filterCloseHandler);
                this.#filterHeader.addEventListener("focus-out", this.#filterFocusOutHandler);

                await crs.call("component", "notify_ready", {element: this});
                resolve();
            })
        });
    }

    async disconnectedCallback() {
        await crs.call("dom_interactive", "disable_resize", {
            element: this.popup
        });

        this.#filterHeader.removeEventListener("close", this.#filterCloseHandler);
        this.#filterHeader.removeEventListener("focus-out", this.#filterFocusOutHandler);
        this.shadowRoot.removeEventListener("click", this.#clickHandler);

        this.#filterHeader = null;
        this.#filterCloseHandler = null;
        this.#filterFocusOutHandler = null;
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
        this.#templates = null;

        await super.disconnectedCallback();
    }

    #optionById(id) {
        const item = this.#options.find(item => item.id == id);
        return item;
    }

    /**
     * @method #buildElements - Builds the elements for the context menu.
     * @returns {Promise<void>}
     */
    async #buildElements() {
        const fragment = document.createDocumentFragment();

        await createListItems(fragment, this.#options, this.#templates);

        this.container.innerHTML = "";
        this.container.appendChild(fragment);

        if (this.#context) {
            await crs.binding.staticInflationManager.inflateElements(this.container.children, this.#context);
        }
    }

    async #click(event) {
        if (event.target.matches(".back")) {
            return await this.#filterClose();
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

        await this.#filterClose();
    }

    async #filterClose(event) {
        await crs.call("context_menu", "close");
    }

    async #filterFocusOut(event) {
        // JHR: todo, filter the items as you type.
    }

    /**
     * @method setOptions - Sets the options for the context menu.
     * This is used by the action system to pass information to the context menu that it needs to render the content.
     * @param args {Object} - The options for the context menu.
     * @param args.options {Array} - An array of options to display in the context menu.
     * @param [args.point] {Object} - The point to position the context menu at.
     * @param [args.at] {String} - The position of the context menu relative to the point. (top, bottom, left, right)
     * @param [args.anchor] {String} - The position of the point relative to the context menu. (top, bottom, left, right)
     * @param [args.target] {HTMLElement} - The target element to position the context menu relative to.
     * @param [args.context] {Object} - The context to use when inflating the context menu. used to execute a process with the menu item.
     * @param [args.process] {String} - The process to call when an option is selected. used to execute a process with the menu item.
     * @param [args.item] {Object} - The item to pass to the process when an option is selected. used to execute a process with the menu item.
     * @param [args.margin] {Number} - The margin to use when positioning the context menu.
     * @param [args.templates] {Object} - The templates to use when rendering the context menu.
     * @param [args.height] {String} - The default height of the context menu.
     * @param [args.style] {Object} - The style to apply to the context menu.
     *
     * Relative to a component:
     * - set target to the component
     * - set at to the location of the context menu relative to the component
     * - set anchor to the align the menu to the component. for example if align is "top" the top of the component and the top of the menu will be the same.
     * - set margin to the distance between the component and the menu.
     *
     * Relative to a point:
     * - set point to the point to position the menu at.
     */
    setOptions(args) {
        this.#options = args.options;
        this.#point = args.point;
        this.#at = args.at;
        this.#anchor = args.anchor;
        this.#target = args.target;
        this.#context = args.context;
        this.#process = args.process;
        this.#item = args.item;
        this.#margin = args.margin;
        this.#templates = args.templates;

        if (typeof args.height == "number") {
            args.height = `${args.height}px`
        }

        this.style.setProperty("--height", args.height);

        if (args.style != null) {
            for (const key of Object.keys(args.style)) {
                this.style.setProperty(key, args.style[key]);
            }
        }
    }
}

/**
 * @method createListItems - Creates the list items for the context menu.
 * @param parentElement {HTMLElement} - The parent element to add the list items to.
 * @param collection {Array} - The collection of options to create the list items from.
 * @param templates {Object} - The templates to use when creating the list items.
 * @returns {Promise<void>}
 */
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

        if (templates != null && option.template != null) {
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