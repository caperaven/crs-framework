export class ToolTips extends HTMLElement {
    #element = document.createElement("div");
    #handleEventHandler = this.#handleEvent.bind(this);

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

        this.appendChild(this.#element);
        await showOnScreen(this.#element, event);

        if (event.duration != null) {
            const timeout = setTimeout(() => {
                clearTimeout(timeout);
                this.#hide();
            }, event.duration);
        }
    }

    async #hide() {
        this.#element.remove();
        this.#element.innerHTML = "";
    }
}

function applyElementStyles(element) {
    element.style.position = "fixed";
    element.style.top = "0";
    element.style.left = "0";
    element.style.border = "1px solid silver";
    element.style.backgroundColor = "white";
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