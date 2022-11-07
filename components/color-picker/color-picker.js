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

        super.disconnectedCallback();
    }

    async attributeChangedCallback(name, oldValue, newValue) {
        this.panel?.setAttribute("value", newValue);
    }

    async #panelMouseDown(event) {
        event.preventDefault();

        this.#panelMove = true;
        this.#x = event.clientX - this.#bounds.x;
        this.#y = event.clientY - this.#bounds.y;

        this.registerEvent(document, "mousemove", this.#panelMouseMoveHandler);
        this.registerEvent(document, "mouseup", this.#panelMouseUpHandler);
        await this.#animate();
    }

    async #panelMouseMove(event) {
        event.preventDefault();

        const point = ptInRect({x: event.clientX, y: event.clientY}, this.#panelBounds);

        this.#x = point.x - this.#bounds.left;
        this.#y = point.y - this.#bounds.top;
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
        requestAnimationFrame(() => {
            if (this.#panelMove == false) return;
            this.panelSelector.style.translate = `${this.#x - 8}px ${this.#y - 8}px`;
            this.#animate();
        })
    }
}

function ptInRect(point, rect) {
    if (point.x < rect.x) {
        point.x = rect.x;
    }

    if (point.x > rect.right) {
        point.x = rect.right;
    }

    if (point.y < rect.y) {
        point.y = rect.y;
    }

    if (point.y > rect.bottom) {
        point.y = rect.bottom;
    }

    return point;
}

customElements.define("color-picker", ColorPicker);