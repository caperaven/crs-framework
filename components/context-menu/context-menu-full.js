import "./../filter-header/filter-header.js";
import {buildElements} from "./utils/build-elements.js";

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
        const li = await crs.call("dom_utils", "find_parent_of_type", {
            element: event.target,
            nodeName: "li",
            stopAtNodeName: "ul"
        });
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