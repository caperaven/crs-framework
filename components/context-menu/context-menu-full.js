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

                await crs.call("component", "notify_ready", {element: this});
                resolve();
            })
        });
    }

    async disconnectedCallback() {
        this.#options = null;
        this.#target = null;
        this.#context = null;
        this.#process = null;
        this.#item = null;
        this.#templates = null;
        this.#filterHeader = null;
        super.disconnectedCallback();
    }

    async #filterClose() {
        await crs.call("context_menu", "close");
    }

    async #click(event) {
        if (event.composedPath()[0] === this.btnBack) {
            return this.#closeSubGroup();
        }

        await handleSelection(event, this.#options, this);

        if (this.btnBack == null) return;

        const hasSubGroup = this.shadowRoot.querySelectorAll(".parent-menu-item[aria-expanded='true']").length > 0

        if (!hasSubGroup) {
            this.btnBack.classList.remove("visible");
        }
        else if (!this.btnBack.classList.contains("visible")) {
            this.btnBack.classList.add("visible");
        }
    }

    #closeSubGroup() {
        const groups = this.shadowRoot.querySelectorAll(".parent-menu-item[aria-expanded='true']");
        groups[groups.length -1].removeAttribute("aria-expanded");

        if (groups.length == 1) {
            this.btnBack.classList.remove("visible")
        }
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