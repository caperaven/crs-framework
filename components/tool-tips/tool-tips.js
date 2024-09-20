export class ToolTips extends HTMLElement {
    #element = document.createElement("div");
    #handleEventHandler = this.#handleEvent.bind(this);
    #timeout;
    #stylesBackup;

    async connectedCallback() {
        this.style.position = "fixed";
        this.style.top = "0";
        this.style.left = "0";
        this.style.zIndex = "2147483647";
        this.style.pointerEvents = "none";

        applyElementStyles(this.#element);
        await crsbinding.events.emitter.on("tooltip", this.#handleEventHandler)
    }

    async disconnectedCallback() {
        await crsbinding.events.emitter.remove("tooltip", this.#handleEventHandler);
        this.#element = null;
        this.#handleEventHandler = null;
    }

    async #handleEvent(event) {
        const actionsTable = {
            "show": this.#show,
            "hide": this.#hide
        }

        actionsTable[event.action].call(this, event);
    }

    async #show(event) {
        await this.#hide();

        this.#element.style.translate = `-100000px -100000px`;

        if (typeof event.tooltip === "string") {
            this.#element.textContent = event.tooltip;
        }
        else {
            this.#element.appendChild(event.tooltip);
        }

        this.#applyStyles(event);

        this.appendChild(this.#element);
        await showOnScreen(this.#element, event);

        if (event.duration != null) {
            this.#timeout = setTimeout(() => {
                clearTimeout(this.#timeout);
                this.#hide();
            }, event.duration);
        }
    }

    async #hide() {
        clearTimeout(this.#timeout);

        if (this.#stylesBackup != null) {
            for (const key in this.#stylesBackup) {
                this.#element.style[key] = this.#stylesBackup[key];
            }

            this.#stylesBackup = null;
        }

        this.#element.remove();
        this.#element.innerHTML = "";
    }

    #applyStyles(event) {
        if (event.styles == null) return;

        const backup = {};

        for (const key in event.styles) {
            backup[key] = this.#element.style[key];
            this.#element.style[key] = event.styles[key];
        }

        this.#stylesBackup = backup
    }
}

function applyElementStyles(element) {
    element.style.position = "fixed";
    element.style.top = "0";
    element.style.left = "0";
    element.style.border = "1px solid silver";
    element.style.background = "var(--grey-s3)";
    element.style.padding = "0.5rem";
}

async function showOnScreen(element, event) {
    if (event.point != null) {
        await crs.call("fixed_layout", "set", {
            element: element,
            point: event.point,
            at: "top",
            anchor: "left"
        });
    }
    else {
        await crs.call("fixed_layout", "set", {
            element: element,
            target: event.element,
            at: "top",
            anchor: "middle"
        });
    }
}

customElements.define("tool-tips", ToolTips);