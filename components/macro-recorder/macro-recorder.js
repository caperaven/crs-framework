import { inputStep, clickStep } from "./steps.js";
import { getQuery } from "./query.js";

export class MacroRecorder extends HTMLElement {
    #currentStep       = null;
    #steps            = [];
    #clickTimer        = null;

    #globalClickHandler     = this.#globalClick.bind(this);
    #globalDblClickHandler  = this.#globalDblClick.bind(this);
    #globalKeyDownHandler   = this.#globalKeyDown.bind(this);
    #globalKeyUpHandler     = this.#globalKeyUp.bind(this);
    #globalFocusInHandler   = this.#globalFocusIn.bind(this);
    #globalFocusOutHandler  = this.#globalFocusOut.bind(this);
    #clickHandler           = this.#click.bind(this);

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        const cssUrl = new URL("./macro-recorder.css", import.meta.url);
        const htmlUrl = new URL("./macro-recorder.html", import.meta.url);

        const html = await fetch(htmlUrl).then(result => result.text());
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${cssUrl}">
            ${html}
        `

        await this.load();
    }

    async load() {
        requestAnimationFrame(async () => {
            this.shadowRoot.addEventListener("click", this.#clickHandler, { capture: true, passive: true });
            await crs.call("component", "notify_ready", { element: this });
        })
    }

    async disconnectedCallback() {
        await this.#disableGlobalEvents();
        this.shadowRoot.removeEventListener("click", this.#clickHandler);
    }

    async #enableGlobalEvents() {
        document.addEventListener("click", this.#globalClickHandler, { capture: true, passive: true });
        document.addEventListener("dblclick", this.#globalDblClickHandler, { capture: true, passive: true });
        document.addEventListener("keydown", this.#globalKeyDownHandler, { capture: true, passive: true });
        document.addEventListener("keyup", this.#globalKeyUpHandler, { capture: true, passive: true });
        document.addEventListener("focusin", this.#globalFocusInHandler, { capture: true, passive: true });
    }

    async #disableGlobalEvents() {
        document.removeEventListener("click", this.#globalClickHandler);
        document.removeEventListener("dblclick", this.#globalDblClickHandler);
        document.removeEventListener("keydown", this.#globalKeyDownHandler);
        document.removeEventListener("keyup", this.#globalKeyUpHandler);
        document.removeEventListener("focusin", this.#globalFocusInHandler);
    }

    async #click(event) {
        const target = event.composedPath()[0];
        const action = target.dataset.action;

        if (action === "macro-start") {
            await this.listening();
        }
        else if (action === "macro-stop") {
            await this.stopListening();
        }
    }


    async #globalClick(event) {
        const path = event.composedPath();
        if (path.includes(this)) return;

        clearTimeout(this.#clickTimer);
        this.#clickTimer = setTimeout(() => {
            const step = structuredClone(clickStep);
            step.args.query = getQuery(path);

            if (event.button === 2) {
                step.action = "context_click"
            }

            this.#steps.push(step);
        }, 200);
    }

    async #globalDblClick(event) {
        clearTimeout(this.#clickTimer);

        const step = structuredClone(clickStep);
        step.args.query = getQuery(event.composedPath());
        step.action = "double_click";

        this.#steps.push(step);
    }

    async #globalKeyDown(event) {
        const path = event.composedPath();
    }

    async #globalKeyUp(event) {
        const path = event.composedPath();
    }

    async #globalFocusIn(event) {
        const path = event.composedPath();

        if (path[0].tagName === "INPUT") {
            // check for type value operations
            this.#currentStep = structuredClone(inputStep);
            this.#currentStep.args.query = getQuery(path);
            this.#currentStep.cache = { value: path[0].value };
            document.addEventListener("focusout", this.#globalFocusOutHandler, { capture: true, passive: true });
        }
    }

    async #globalFocusOut(event) {
        const target = event.composedPath()[0];

        document.removeEventListener("focusout", this.#globalFocusOutHandler, { capture: true, passive: true });

        const value = target.value;

        if (value !== this.#currentStep.cache.value) {
            delete this.#currentStep.cache;
            this.#currentStep.args.value = value;
            this.#steps.push(structuredClone(this.#currentStep));
        }

        this.#currentStep = null;
    }

    async listening() {
        await this.#enableGlobalEvents();
    }

    async stopListening() {
        await this.#disableGlobalEvents();
    }
}

customElements.define("macro-recorder", MacroRecorder);