import "./../filter-header/filter-header.js";
import {buildElements} from "./utils/build-elements.js";
import {handleSelection} from "./utils/select-item-handler.js";

class ContextMenu extends crsbinding.classes.BindableElement {
    #options;
    #target;
    #context;
    #process;
    #item;
    #templates;
    #clickHandler = this.#click.bind(this);
    #filterCloseHandler = this.#filterClose.bind(this);
    #filterHeader;

    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async connectedCallback() {
        super.connectedCallback();
    }

    async preLoad() {
        await crsbinding.translations.add(globalThis.translations.contextMenu, "contextMenu");
    }

    async load() {
        return new Promise(async (resolve) => {
            requestAnimationFrame(async () => {
                this.addEventListener("click", this.#clickHandler);

                await buildElements.call(this, this.#options, this.#templates, this.#context, this.container);

                this.#filterHeader = this.shadowRoot.querySelector("filter-header");
                this.#filterHeader.addEventListener("close", this.#filterCloseHandler);
                this.#filterHeader.container = this.container;

                await crs.call("component", "notify_ready", {element: this});

                resolve();
            })
        });
    }

    async disconnectedCallback() {
        this.removeEventListener("click", this.#clickHandler);
        this.#filterHeader.removeEventListener("close", this.#filterCloseHandler);

        this.#options = null;
        this.#target = null;
        this.#context = null;
        this.#process = null;
        this.#item = null;
        this.#templates = null;
        this.btnBack = null;
        this.spanBorder = null;
        this.groupHeader = null;
        this.container = null;
        this.#filterHeader.container = null;
        this.#filterHeader = null;
        super.disconnectedCallback();
    }

    /**
     * @method #filterClose - Closes the context menu.
     * @returns {Promise<void>}
     */
    async #filterClose() {
        await crs.call("context_menu", "close");
    }

    /**
     * @method #click - Handles the click event on the context menu.
     * @param event - The click event.
     * @returns {Promise<void>}
     */
    async #click(event) {
        const element = event.composedPath()[0];
        const className = element.className;

        if ( element.id === "input-filter" || element.dataset.ignoreClick === "true") return;

        if (element === this.btnBack) {
            return await this.#closeSubGroup();
        }

        if (element.parentElement?.dataset.closable == null) {
            await this.#filterClose();
            return;
        }

        await handleSelection(element, this.#options, this);

        if (element.matches(".parent-menu-item") === true) {
            this.groupHeader.textContent = element.getAttribute("aria-label");

            await this.#toggleHeaderType(true)

            element.parentElement.classList.add("child-expanded")
            await this.#handleButtonState();
        }
    }

    /**
     * @method #toggleHeaderType - Toggles the header type based on the sub group expansion.
     * @param isHidden {Boolean} - a boolean value that indicates if the sub group is expanded.
     * @returns {Promise<void>}
     */
    async #toggleHeaderType(isHidden) {
        this.#filterHeader.setAttribute("aria-hidden", isHidden);
        this.groupHeader.setAttribute("aria-hidden", !isHidden);
    }

    /**
     * @method #handleButtonState - Handles the visibility of the back button based on the sub group expansion.
     * @returns {Promise<void>}
     */
    async #handleButtonState() {
        const subGroups = this.shadowRoot.querySelectorAll(".parent-menu-item[aria-expanded='true']");
        const hasSubGroup = subGroups.length > 0;

        if (!hasSubGroup) {
            await this.#toggleBackButtonVisible(false);
            return;
        }

        await this.#toggleBackButtonVisible(true);
    }

    /**
     * @method #toggleBackButtonVisible - Toggles the visibility of the back button and Span.
     * @param isVisible {Boolean} - a boolean value that indicates if the back button is visible.
     * @returns {Promise<void>}
     */
    async #toggleBackButtonVisible(isVisible) {
        this.btnBack.dataset.visible = isVisible;
    }

    /**
     * @method #closeSubGroup - Closes the sub group by removing the aria-expanded attribute.
     * @returns {Promise<void>}
     */
    async #closeSubGroup() {
        const groups = this.shadowRoot.querySelectorAll(".parent-menu-item[aria-expanded='true']");
        const li = groups[groups.length - 1];

        li.removeAttribute("aria-expanded");
        li.parentElement.classList.remove("child-expanded");

        if (groups.length > 1) {
            this.groupHeader.textContent = groups[groups.length - 2].getAttribute("aria-label");
        }

        if (groups.length == 1) {
            await this.#toggleHeaderType(false);
            await this.#toggleBackButtonVisible(false);
        }
    }

    /**
     * @method setOptions - Sets the options for the context menu.
     * @param args {object} - The options for the context menu.
     */
    setOptions(args) {
        this.#options = args.options;
        this.#target = args.target;
        this.#context = args.context;
        this.#process = args.process;
        this.#item = args.item;
        this.#templates = args.templates;

        if (args.style != null) {
            for (const key of Object.keys(args.style)) {
                this.style.setProperty(key, args.style[key]);
            }
        }
    }
}

customElements.define("context-menu", ContextMenu);