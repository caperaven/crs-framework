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
                this.shadowRoot.addEventListener("click", this.#clickHandler);

                await buildElements.call(this, this.#options, this.#templates, this.#context, this.container);

                this.#filterHeader = this.shadowRoot.querySelector("filter-header");
                this.#filterHeader.addEventListener("close", this.#filterCloseHandler);
                this.#filterHeader.container = this.container;

                await crs.call("component", "notify_ready", {element: this});

                await this.#asserOverflowIsRequired(this.container, this.popup);
                resolve();
            })
        });
    }

    async disconnectedCallback() {
        this.shadowRoot.removeEventListener("click", this.#clickHandler);
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
        const tagName = element.tagName.toLowerCase();
        const className = element.className;

        if (tagName === "filter-header" || element.id === "input-filter" || className === "submenu") return;

        if (className === "back") {
            await crs.call("context_menu", "close");
            return;
        }

        if (element === this.btnBack) {
            return await this.#closeSubGroup();
        }

        if (element.matches(".parent-menu-item") === true) {
            this.groupHeader.textContent = element.getAttribute("aria-label");
        }

        await handleSelection(event.composedPath()[0], this.#options, this, this.#filterHeader, true, this.groupHeader);

        if (!element.matches(".parent-menu-item") && this.btnBack == null) return;

        await this.#setOffsetAndOverflow(element);
        await this.#handleButtonState();
    }

    /**
     * @method #setOffsetAndOverflow - Sets the overflow property on the ul container based on the content.
     * @param element- the selected parent li element.
     * @returns {Promise<void>}
     */
    async #setOffsetAndOverflow(element) {
        const ul = element.querySelector("ul");
        const ulElementRect = ul.getBoundingClientRect();
        const ulContainerRect = this.container.getBoundingClientRect();

        const offset = ulElementRect.top - ulContainerRect.top;
        if (offset > 0) {
            ul.style.transform = `translateY(${-offset}px)`;
        }

        this.container.style.height = `${ulElementRect.height}px`;

        await this.#asserOverflowIsRequired(ul, this.popup);
    }

    /**
     * @method #asserOverFlowIsRequired - Asserts if the overflow property is required on the ul container.
     * @param element - the ul element.
     * @param container - the parent container of the ul element.
     * @returns {Promise<void>}
     */
    async #asserOverflowIsRequired(element, container) {
        //calculate the height of the ul container
        const assertOverflowRequired = element.scrollHeight > this.popup.scrollHeight;

        if (assertOverflowRequired === true) {
            this.container.classList.remove("no-overflow");
            this.popup.dataset.resizePopup = "true";
            return;
        }

        this.popup.dataset.resizePopup = "false";
        this.container.classList.add("no-overflow");
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
        groups[groups.length - 1].removeAttribute("aria-expanded");

        if (groups.length > 1) {
            this.groupHeader.textContent = groups[groups.length - 2].getAttribute("aria-label");
        }

        if (groups.length == 1) {
            this.container.style.height = "max-content";
            this.btnBack.classList.remove("visible");
            this.spanBorder.classList.remove("visible");
            this.groupHeader.setAttribute("aria-hidden", true);
            this.#filterHeader.setAttribute("aria-hidden", false);
        }

        this.popup.dataset.resizePopup = "true";
        await this.#setOffsetAndOverflow(groups[groups.length - 1].parentElement.parentElement);
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