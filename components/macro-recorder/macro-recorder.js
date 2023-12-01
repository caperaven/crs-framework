import { inputStep, clickStep, process } from "./steps.js";
import { getQuery } from "./query.js";
import { composedPath } from "./composed-path.js";
import { getElementStatus } from "./get-element-status.js";

const inputElements = ["input", "textarea", "select"];

const RecorderState = Object.freeze({
    IDLE        : 0,
    RECORDING   : 1,
    PICKING     : 2,
    GET_STATUS  : 3
})

export class MacroRecorder extends HTMLElement {
    #steps= [];
    #pickLayer = null;
    #clickTimer= null;
    #state= RecorderState.IDLE;
    #buttons= {};
    #cache= {};

    #globalClickHandler     = this.#globalClick.bind(this);
    #globalDblClickHandler  = this.#globalDblClick.bind(this);
    #globalKeyDownHandler   = this.#globalKeyDown.bind(this);
    #globalKeyUpHandler     = this.#globalKeyUp.bind(this);
    #globalFocusInHandler   = this.#globalFocusIn.bind(this);
    #globalFocusOutHandler  = this.#globalFocusOut.bind(this);
    #animationLayerClickHandler = this.#animationLayerClick.bind(this);
    #animationLayerKeyUpHandler = this.#animationLayerKeyUp.bind(this);
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
            this.#buttons["macro-start"] = this.shadowRoot.querySelector('[data-action="macro-start"]');
            this.#buttons["macro-stop"] = this.shadowRoot.querySelector('[data-action="macro-stop"]');
            this.#buttons["macro-clear"] = this.shadowRoot.querySelector('[data-action="macro-clear"]');
            this.#buttons["macro-pick"] = this.shadowRoot.querySelector('[data-action="macro-pick"]');
        })
    }

    async disconnectedCallback() {
        await this.#disableGlobalEvents();
        this.shadowRoot.removeEventListener("click", this.#clickHandler);
        this.#buttons = null;
        this.#state = null;
        this.#clickTimer = null;
        this.#steps = null;
        this.#pickLayer = null;
    }

    async #setState(newState) {
        await this.#disableGlobalEvents();

        // if we were in a picking state, then remove the animation layer
        if (this.#state === RecorderState.PICKING || this.#state === RecorderState.GET_STATUS) {
            this.#pickLayer.removeEventListener("click", this.#animationLayerClickHandler, { capture: true, passive: true });
            this.#pickLayer.removeEventListener("keyup", this.#animationLayerKeyUpHandler, { capture: true, passive: true });
            this.#pickLayer = await crs.call("dom_interactive", "remove_animation_layer");
        }

        for (const element of Object.values(this.#buttons)) {
            element.style.color = "black";
            element.style.fontWeight = "normal";
        }

        this.#state = newState;

        // if the new state is a picking state then create the animation layer and add interaction to it.
        if (this.#state === RecorderState.PICKING || this.#state === RecorderState.GET_STATUS) {
            this.#buttons["macro-pick"].style.color = "red";
            this.#buttons["macro-pick"].style.fontWeight = "bold";

            this.#pickLayer = await crs.call("dom_interactive", "get_animation_layer");
            this.#pickLayer.addEventListener("click", this.#animationLayerClickHandler, { capture: true, passive: true });
            this.#pickLayer.addEventListener("keyup", this.#animationLayerKeyUpHandler, { capture: true, passive: true });
            this.#pickLayer.style.pointerEvents = "auto";
        }

        if (this.#state === RecorderState.RECORDING) {
            this.#buttons["macro-start"].style.color = "red";
            this.#buttons["macro-start"].style.fontWeight = "bold";
            await this.#enableGlobalEvents();
        }
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
        this[event.composedPath()[0].dataset.action]?.(event);
    }

    async "macro-start"() {
        await this.#setState(RecorderState.RECORDING);
    }

    async "macro-stop"() {
        await this.#setState(RecorderState.IDLE);
    }

    async "macro-clear"() {
        this.#steps = [];
    }

    async "macro-pick"() {
        await this.#setState(RecorderState.PICKING);
    }

    async "macro-status"() {
        await this.#setState(RecorderState.GET_STATUS);
    }

    async #animationLayerClick(event) {
        this.#pickLayer.style.pointerEvents = "none";

        try {
            const elementAtPoint = document.elementFromPoint(event.clientX, event.clientY);
            const path = composedPath(elementAtPoint);
            const query = getQuery(path);

            if (this.#state === RecorderState.PICKING) {
                await crs.call("system", "copy_to_clipboard", { source: query });
            }
            else if (this.#state === RecorderState.GET_STATUS) {
                const result = getElementStatus(query, elementAtPoint);
                await crs.call("system", "copy_to_clipboard", { source: result });
            }
        }
        finally {
            this.#pickLayer.style.pointerEvents = "auto";
            await this.#setState(RecorderState.IDLE);
        }
    }

    async #animationLayerKeyUp(event) {
        if (event.key === "Escape") {
            await this.#setState(RecorderState.IDLE);
        }
    }

    async #globalClick(event) {
        const path = event.composedPath();
        if (path.includes(this)) return;

        clearTimeout(this.#clickTimer);
        this.#clickTimer = setTimeout(async () => {
            const step = structuredClone(clickStep);
            step.args.query = getQuery(path);

            if (event.button === 2) {
                step.action = "context_click"
            }

            await this.#addToStack(step);
        }, 200);
    }

    async #globalDblClick(event) {
        clearTimeout(this.#clickTimer);

        const step = structuredClone(clickStep);
        step.args.query = getQuery(event.composedPath());
        step.action = "double_click";

        await this.#addToStack(step);
    }

    async #globalKeyDown(event) {
        const path = event.composedPath();
        if (inputElements.includes(path[0].tagName.toLowerCase()) === true) return;
    }

    async #globalKeyUp(event) {
        const path = event.composedPath();

        if (inputElements.includes(path[0].tagName.toLowerCase()) === true) return;

        // const ctrlDown = event.ctrlKey || event.metaKey;
        // const shiftDown = event.shiftKey;
        // const altDown = event.altKey;
        // const key = event.key.toLowerCase();
        // const query = getQuery(path);
        //
        //
        // console.log(ctrlDown, shiftDown, altDown, key);
        // todo: add key press to support
    }

    async #globalFocusIn(event) {
        const path = event.composedPath();
        const tagName = path[0].tagName.toLowerCase();

        if (inputElements.includes(tagName) === false) return;

        const target = path[0];
        this.#cache[target] = target.value;
        document.addEventListener("focusout", this.#globalFocusOutHandler, { capture: true, passive: true });
    }

    async #globalFocusOut(event) {
        const target = event.composedPath()[0];
        document.removeEventListener("focusout", this.#globalFocusOutHandler, { capture: true, passive: true });

        if (this.#cache[target] != null) {
            const oldValue = this.#cache[target];
            const newValue = target.value;
            delete this.#cache[target];

            if (oldValue !== newValue) {
                const step = structuredClone(inputStep);
                step.args.query = getQuery(event.composedPath());
                step.args.value = newValue;

                await this.#addToStack(step);
            }
        }
    }

    async #addToStack(step) {
        this.#steps.push(structuredClone(step));
    }

    async saveToProcess(name) {
        const instance = structuredClone(process);
        instance.id = name;

        console.log(this.#steps);

        for (let i = 0; i < this.#steps.length; i++) {
            let name = `step_${i}`;
            const nextName = `step_${i + 1}`;

            if (name === "step_0") {
                name = "start";
            }

            const step = this.#steps[i];
            instance.main.steps[name] = step;

            if (i < this.#steps.length - 1) {
                step.next_step = nextName;
            }
        }

        return instance;
    }
}

customElements.define("macro-recorder", MacroRecorder);