/**
 * @class OptionsToolbar - It's a toolbar that allows you to select one of the buttons in it and acts like a Toggle Switch
 *
 * Features:
 * - set_selected - Sets the selected button
 * - click - Handles the click event functionality
 */
class OptionsToolbar extends HTMLElement {
    #marker;
    #clickHandler = this.#click.bind(this);
    #previouslySelected;
    #parent;

    get selected() {
        return this.dataset.value;
    }

    set selected(value) {
        if(value == null) return;
        const element = this.querySelector(`[data-value='${value}']`);
        if(element != null && this.dataset.ready === "true") {
            this.#setSelected(element);
        } else {
            this.dataset.value = value;
        }
    }

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());
        await this.load();
    }

    /**
     * @method load - load the component.
     * set up event listeners and set aria attributes.
     * @returns {Promise<void>}
     */
    load() {
        return new Promise(resolve => {
            requestAnimationFrame(async () => {
                this.setAttribute("role", "toggle-switch");
                this.setAttribute("aria-label", "toggle-switch");

                this.#marker = this.shadowRoot.querySelector(".marker");
                this.#parent = this.shadowRoot.querySelector(".parent");

                const selectedItem = this.querySelector(`[data-value='${this.dataset.value}']`) ?? this.querySelector(`[aria-selected='true']`) ?? this.firstElementChild;
                await this.#setSelected(selectedItem, false);
                this.shadowRoot.addEventListener("click", this.#clickHandler);

                let timeout = setTimeout(() => {
                    if (this.#marker != null) {
                        this.#marker.style.transition = "translate 0.3s ease-out";
                    }
                    clearTimeout(timeout);
                }, 0.5)

                await crs.call("component", "notify_ready", {
                    element: this
                });

                resolve();
            });
        });
    }

    async disconnectedCallback() {
        this.shadowRoot.removeEventListener("click", this.#clickHandler);
        this.#clickHandler = null;
        this.#marker = null;
        this.#previouslySelected = null;
    }

    /**
     * @method setSelected - It sets the selected item in the toolbar
     * @param element - The element to select.
     * @param [dispatchEvent=true] - Whether to dispatch a change event or not.
     */
    async #setSelected(element, dispatchEvent = true) {
        const parentBounds = this.getBoundingClientRect();
        const bounds = element.getBoundingClientRect();

        this.style.setProperty("--width", `${bounds.width}px`);
        this.style.setProperty("--height", `${bounds.height}px`);
        this.#marker.style.translate = `${(bounds.left -1) - (parentBounds.left )}px 4px`;

        await crs.call("dom_collection", "toggle_selection", {
            target: element
        });

        this.dataset.value = element.dataset.value;
        this.#previouslySelected = element;

        if (dispatchEvent === true) {
            this.dispatchEvent(new CustomEvent("change", {detail: element.dataset.value}));
        }
    }

    /**
     * @method click - When a button is clicked, set the selected button to the button that was clicked
     * @param event - The event object that was triggered.
     */
    async #click(event) {
        const target = await crs.call("dom_utils", "find_parent_of_type", {element: event?.target, nodeName: "BUTTON"});
        if (target != null) {
            await this.#setSelected(target);
        }
    }

}

customElements.define("options-toolbar", OptionsToolbar);