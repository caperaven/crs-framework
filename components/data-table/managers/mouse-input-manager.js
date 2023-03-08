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

        this.#table.addEventListener('click', this.#clickHandler);
        this.#table.addEventListener('dblclick', this.#dblclickHandler);
    }

    dispose() {
        this.#table.removeEventListener('click', this.#clickHandler);
        this.#table.removeEventListener('dblclick', this.#dblclickHandler);
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