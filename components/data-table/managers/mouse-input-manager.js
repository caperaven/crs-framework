/**
 * @class MouseInputManager - this class deals with all mouse input events and what happens during those events
 */
export class MouseInputManager {
    #table;
    #clickHandler;
    #dblclickHandler;

    constructor(table) {
        this.#table = table;
        this.#clickHandler = this.#click.bind(table);
        this.#dblclickHandler = this.#dblclick.bind(table);

        this.#table.shadowRoot.addEventListener('click', this.#clickHandler);
        this.#table.shadowRoot.addEventListener('dblclick', this.#dblclickHandler);
    }

    dispose() {
        this.#table.shadowRoot.removeEventListener('click', this.#clickHandler);
        this.#table.shadowRoot.removeEventListener('dblclick', this.#dblclickHandler);
        this.#table = null;
        this.#clickHandler = null;
        this.#dblclickHandler = null;
        return null;
    }

    async #click(event) {

    }

    async #dblclick(event) {

    }
}