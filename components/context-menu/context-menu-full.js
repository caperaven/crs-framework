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

        await handleSelection(event.composedPath()[0], this.#options, this, this.#filterHeader, true);

        if (!element.matches(".parent-menu-item") && this.btnBack == null) return;

        await this.#setUlContainerOverflow(element);
        await this.#handleButtonState();
    }

    /**
     * @method #setUlContainerOverflow - Sets the overflow property on the ul container based on the content.
     * @param element- the selected parent li element.
     * @returns {Promise<void>}
     */
    async #setUlContainerOverflow(element) {
        const ul = element.querySelector("ul");
        const submenuUlRect = ul.getBoundingClientRect();
        const ulMenuRect = this.container.getBoundingClientRect();

        //positions the submenu relative to the container and not the parent li element.
        const offset = submenuUlRect.top - ulMenuRect.top;
        if (offset > 0) {
            ul.style.transform = `translateY(${-offset}px)`;
        }

        //if overflow is required for the sub menu if not remove it
        const addOverflow = ul.scrollHeight > ul.clientHeight;
        if (addOverflow === false) {
            this.container.classList.add("no-overflow");
            return;
        }

        this.container.classList.remove("no-overflow");
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

        } else if (!this.btnBack.classList.contains("visible")) {
            this.btnBack.classList.add("visible");
            this.spanBorder.classList.add("visible");
        }

        if (subGroups.length > 0) {
            const container = subGroups[subGroups.length - 1].querySelector("ul");
            this.#filterHeader.container = container;
        } else {
            this.#filterHeader.container = this.container;
        }
    }

    async #closeSubGroup() {
        const groups = this.shadowRoot.querySelectorAll(".parent-menu-item[aria-expanded='true']");
        groups[groups.length - 1].removeAttribute("aria-expanded");

        if (groups.length == 1) {
            this.btnBack.classList.remove("visible");
            this.spanBorder.classList.remove("visible");
        }
        await this.#setUlContainerOverflow(groups[groups.length - 1].parentElement.parentElement);
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