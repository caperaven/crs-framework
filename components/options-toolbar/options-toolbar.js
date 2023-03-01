/**
 * @class OptionsToolbar - It's a toolbar that allows you to select one of the buttons in it and acts like a Toggle Switch
 *
 * Features:
 * - set_selected - Sets the selected button
 * - click - Handles the click event functionality
 */
class OptionsToolbar extends HTMLElement {
    #marker;
    #clickHandler;
    #previouslySelected;
    #parent;

    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.#clickHandler = this.#click.bind(this);
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
                await crs.call("component", "notify_ready", {
                    element: this
                });

                this.#marker = this.shadowRoot.querySelector(".marker");
                this.#parent = this.shadowRoot.querySelector(".parent");

                const selectedItem = this.querySelector(`[aria-selected='true']`) ?? this.firstElementChild;
                await this.#setSelected(selectedItem, false);
                this.addEventListener("click", this.#clickHandler);

                let timeout = setTimeout(() => {
                    if (this.#marker != null){
                        this.#marker.style.transition = "translate 0.3s ease-out";
                    }
                    clearTimeout(timeout);
                }, 0.5)

                resolve();
            });
        });
    }

    async disconnectedCallback() {
        this.removeEventListener("click", this.#clickHandler);
        this.#marker = null;
        this.#clickHandler = null;
        this.#previouslySelected = null;
    }

    /**
     * @method setSelected - It sets the selected item in the dropdown
     * @param element - The element to select.
     * @param [dispatchEvent=true] - Whether to dispatch a change event or not.
     */
    async #setSelected(element, dispatchEvent= true) {
        const parentBounds = this.getBoundingClientRect();
        const bounds = element.getBoundingClientRect();

        this.style.setProperty("--width", `${bounds.width}px`);
        this.style.setProperty("--height", `${bounds.height}px`);
        this.#marker.style.translate = `${bounds.left - parentBounds.left}px 4px`;

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
        const target = await crs.call("dom_utils", "find_parent_of_type", { element: event?.target, nodeName: "BUTTON" });
        if (target) {
            await this.#setSelected(target);
        }
    }
}

customElements.define("options-toolbar", OptionsToolbar);