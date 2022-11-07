import "./color-gradient.js";
import "./color-panel.js";

class ColorPicker extends crsbinding.classes.BindableElement {
    #bounds;
    #panelBounds;
    #gradientBounds;
    #x;
    #y;
    #panelMove = false;
    #panelMouseDownHandler = this.#panelMouseDown.bind(this);
    #panelMouseMoveHandler = this.#panelMouseMove.bind(this);
    #panelMouseUpHandler = this.#panelMouseUp.bind(this);

    #currentBounds;
    #currentElement;

    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get baseColor() {
        return this.getAttribute("value");
    }

    set baseColor(newValue) {
        this.setAttribute("value", newValue);
    }

    static get observedAttributes() { return ["value"]; }

    async connectedCallback() {
        await super.connectedCallback();
        this.#bounds = this.getBoundingClientRect();
        this.#panelBounds = this.panel.getBoundingClientRect();
        this.#gradientBounds = this.gradient.getBoundingClientRect();
        this.panel.setAttribute("value", this.baseColor || "#FF0000");
        this.registerEvent(this, "mousedown", this.#panelMouseDownHandler);
        await this.#setPanelSelector(0, 0, this.panelSelector);
    }

    async disconnectedCallback() {
        this.#bounds = null;
        this.#panelBounds = null;
        this.#gradientBounds = null;
        this.#x = null;
        this.#y = null;
        this.#panelMove = null;
        this.#panelMouseDownHandler = null;
        this.#panelMouseMoveHandler = null;
        this.#panelMouseUpHandler = null;

        this.#currentBounds = null;
        this.#currentElement = null;

        super.disconnectedCallback();
    }

    async attributeChangedCallback(name, oldValue, newValue) {
        this.panel?.setAttribute("value", newValue);
    }

    async #setPanelSelector(x, y, element) {
        x -= 8;
        y -= 8;
        element.style.translate = `${x}px ${y}px`;
    }

    async #panelMouseDown(event) {
        event.preventDefault();

        this.#panelMove = true;
        this.#x = event.clientX - this.#bounds.x;
        this.#y = event.clientY - this.#bounds.y;

        if (event.path[0] == this.panel) {
            this.#currentBounds = this.#panelBounds;
            this.#currentElement = this.panelSelector;
        }
        else {
            this.#currentBounds = this.#gradientBounds;
            this.#currentElement = this.gradientSelector;
        }

        this.registerEvent(document, "mousemove", this.#panelMouseMoveHandler);
        this.registerEvent(document, "mouseup", this.#panelMouseUpHandler);
        await this.#animate();
    }

    async #panelMouseMove(event) {
        event.preventDefault();

        this.#x = event.clientX - this.#bounds.x;
        this.#y = event.clientY - this.#bounds.y;
    }

    async #panelMouseUp(event) {
        event.preventDefault();

        this.#panelMove = false;
        this.unregisterEvent(document, "mousemove", this.#panelMouseMoveHandler);
        this.unregisterEvent(document, "mouseup", this.#panelMouseUpHandler);
        this.#x = null;
        this.#y = null;
    }

    async #animate() {
        if (this.#panelMove == false) return;

        requestAnimationFrame(() => {
            this.#setPanelSelector(this.#x, this.#y, this.#currentElement);
            this.#animate();
        })
    }
}

customElements.define("color-picker", ColorPicker);