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

        this.#filterHeader.container = null;
        this.#filterHeader = null;
        super.disconnectedCallback();
    }

    async #filterClose() {
        await crs.call("context_menu", "close");
    }

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

        await handleSelection(event.composedPath()[0], this.#options, this);

        if (element.matches(".parent-menu-item") === true) {
            this.groupHeader.textContent = element.getAttribute("aria-label");

            await this.#toggleHeaderType(true)
            element.parentElement.classList.add("child-expanded")
            await this.#handleButtonState();
        }
    }

    /**
     * @method #toggleHeaderType - Toggles the header type based on the sub group expansion.
     * @param isSubMenu {Boolean} - a boolean value that indicates if the sub group is expanded.
     * @returns {Promise<void>}
     */
    async #toggleHeaderType(isSubMenu) {
        let isHidden = true;
        if (this.#filterHeader.getAttribute("aria-hidden") === "true" && isSubMenu === false) {
            isHidden = false;
        }

        this.#filterHeader.setAttribute("aria-hidden", isHidden);
        this.groupHeader.setAttribute("aria-hidden", !isHidden);
    }

    /**
     * @method #handleButtonState - Handles the visibility of the back button based on the sub group expansion.
     * @param backButton - the back button element.
     * @returns {Promise<void>}
     */
    async #handleButtonState() {
        const subGroups = this.shadowRoot.querySelectorAll(".parent-menu-item[aria-expanded='true']");
        const hasSubGroup = subGroups.length > 0;

        if (!hasSubGroup) {
            this.btnBack.classList.remove("visible");
            this.spanBorder.classList.remove("visible");
        }
        else if (!this.btnBack.classList.contains("visible")) {
            this.btnBack.classList.add("visible");
            this.spanBorder.classList.add("visible");
        }

    }

    async #closeSubGroup() {
        const groups = this.shadowRoot.querySelectorAll(".parent-menu-item[aria-expanded='true']");

        const li = groups[groups.length - 1];
        li.removeAttribute("aria-expanded");

        li.parentElement.classList.remove("child-expanded");

        if (groups.length > 1) {
            this.groupHeader.textContent = groups[groups.length - 2].getAttribute("aria-label");
        }

        if (groups.length == 1) {
            this.btnBack.classList.remove("visible");
            this.spanBorder.classList.remove("visible");
            await this.#toggleHeaderType(false);
        }
    }

    /**
     * @method #resetUl - Resets the height of the ul container.
     * @param event - the event object.
     * @returns {Promise<void>}
     */
    async resetUlHeight(event) {
        this.container.style.height = "";
    }

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