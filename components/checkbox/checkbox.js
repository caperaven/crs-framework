/**
 * @class Checkbox - A custom tristate checkbox element.
 *
 * on clicking the component, the state will cycle through "checked", "unchecked", and "null".
 *
 * state order :
 * 1. checked
 * 2. unchecked
 * 3. null
 *
 * NOTE: data-state and data-title are read-only properties for testability
 *
 * @example <caption>Example usage of the checkbox component.</caption>
 * // this only allows checked and unchecked states
 * <check-box checked.bind="model.checked" data-state="checked" data-title="Checkbox"></check-box>
 *
 * @example <caption>Example usage of the checkbox component as tristate.</caption>
 * // to allow null state, set data-nullable="true"
 * <check-box checked.bind="model.checked" data-state="checked" data-title="Checkbox" data-nullable="true"></check-box>
 */
export class Checkbox extends HTMLElement {
    #stateText = {
        true: "check-box",
        false: "check-box-blank",
        mixed: "check-box-mixed"
    }

    #checked;
    #iconElement;
    #titleElement;
    #clickHandler = this.#clicked.bind(this);

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get checked() {
        return this.#checked;
    }

    set checked(newValue) {
        this.#checked = newValue;
        this.#setState(newValue);
    }

    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.setAttribute("aria-checked", "false");
        this.setAttribute("role", "checkbox");
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch(this.html).then(result => result.text());
        await this.load();
    }

    load() {
        return new Promise(resolve => {
            requestAnimationFrame(async () => {
                this.shadowRoot.addEventListener("click", this.#clickHandler);
                this.#iconElement = this.shadowRoot.querySelector("#btnCheck");
                this.#titleElement = this.shadowRoot.querySelector("#lblText");

                this.#setState(this.getAttribute("aria-checked"))
                this.#titleElement.innerText = this.getAttribute("aria-label");
                resolve();
            })
        })
    }

    async disconnectedCallback() {
        this.shadowRoot.removeEventListener("click", this.#clickHandler);
        this.#clickHandler = null;
    }

    /**
     * It sets the state of the checkbox to the value passed in, and updates the icon and aria-checked attributes
     * accordingly
     * @param value - The value to set the checkbox to.
     */
    #setState (value) {
        const nullable = this.dataset.nullable == "true";
        const state = {
            true: "true",
            false: "false",
            mixed: nullable ? "mixed" : "false"
        }

        this.setAttribute("aria-checked", state[value]);
        this.setAttribute("data-state", state[value]);
        this.#iconElement.innerText = this.#stateText[state[value]];
        this.#iconElement.setAttribute("aria-checked", state[value]);

    }

    /**
     * @method clicked - Handles the click event.
     * Get the next state and use setState to set the state.
     *
     * It toggles the state of the checkbox
     * @param event - The event object that was triggered.
     */
    #clicked (event) {
        const nullable = this.dataset.nullable == "true";
        const state = this.getAttribute("aria-checked");
        const nextState = {
            true: "false",
            false: nullable ? "mixed" : "true",
            mixed: "true"
        }[state];
        this.#setState(nextState);
    }

}

customElements.define("check-box", Checkbox);