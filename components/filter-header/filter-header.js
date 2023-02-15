/**
 * @class FilterHeader - It's a custom element that filters the children of a container element.
 *
 * Features:
 * filter - filters the children of the container element
 * close - closes the filter
 *
 */
class FilterHeader extends crsbinding.classes.BindableElement {
    #container;

    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    constructor() {
        super();
        // this.attachShadow({ mode: "open" });
    }

    /**
     * @method connectedCallback - When the component is added to the DOM, the container element is set to the element
     * that has the id that is specified in the "for" attribute.
     */
    async connectedCallback() {
        super.connectedCallback();
        // const query = this.getAttribute("for");
        // this.#container = this.parentElement.querySelector(query);
        // this.shadowRoot.innerHTML = await fetch(this.html).then(result => result.text());
        await this.load();

    }

    load() {
        return new Promise(resolve => {
            requestAnimationFrame(async () => {
                const query = this.getAttribute("for");
                this.#container = this.parentElement.querySelector(query);
                resolve();
            });
        });
    }

    /**
     * @method disconnectedCallback - When the component is removed from the DOM, the container is set to null
     */
    async disconnectedCallback() {
        this.#container = null;
        await super.disconnectedCallback();
    }

    /**
     * @method filter - "If the user presses the down arrow key, then dispatch a focus-out event. Otherwise, filter the children of the
     * container element based on the value of the input element."
     *
     * The first line of the function is an if statement. If the event's code is "ArrowDown", then the function will return
     * the result of the dispatchEvent function. The dispatchEvent function is a built-in JavaScript function that
     * dispatches an event. The event that is dispatched is a CustomEvent. A CustomEvent is a type of event that can be
     * created by the user. The CustomEvent is named "focus-out"
     * @param event - The event object that was passed to the event listener.
     * @returns the result of the dispatchEvent function.
     */
    async filter(event) {
        if (event.code == "ArrowDown") {
            return this.dispatchEvent(new CustomEvent("focus-out"));
        }

        await crs.call("dom_collection", "filter_children", {
            filter: event.target.value.toLowerCase(),
            element: this.#container
        })
    }

    /**
     * The function `close()` dispatches a custom event called `close` to the DOM
     */
    async close() {
        this.dispatchEvent(new CustomEvent("close"));
    }
}

customElements.define("filter-header", FilterHeader);