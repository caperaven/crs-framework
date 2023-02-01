/**
 * @class Dialog - show a dialog relative to an element.
 * If no element is specified, the dialog is shown relative to the viewport (center).
 *
 * Features:
 * 1. The dialog is shown relative to the element specified by the "for" attribute.
 * 2. The dialog is shown relative to the viewport if no element is specified.
 * 3. Allow custom header, footer and content.
 * 4. Allow more than one stack of custom {header, footer, content} to be shown. with a push and pop API.
 * 5. Allow resize of container - from bottom right corner, lef edge, right edge and bottom edge (custom process api feature).
 * 6. Allow drag of container.
 * 7. Allow close of container (the entire stack).
 * 8. Maximize container
 * 9. Show backdrop
 *
 * Stack Features:
 * 1. Allow push and pop of stack.
 * 2. Allow custom header, footer and content.
 * 3. Stack can have a custom size and the container needs to resize accordingly.
 */
export class Dialog extends HTMLElement {
    #stack = [];
    #actions = {
        "btnClose": this.#closeClicked.bind(this),
        "btnResize": this.#resizeClicked.bind(this),
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {

    }

    async disconnectedCallback() {

    }

    /**
     * clean all internal data and remove all event listeners.
     */
    dispose() {
        // remove all event listeners

        this.#stack = null;
        this.remove();
    }

    /**
     * @method click - handle click events
     * @param event
     * @returns {Promise<void>}
     */
    async #click(event) {
        const id = event.target.id;
        this.#actions[id]?.();
    }

    /**
     * @method #resizeClicked - show resize dialog by toggling fullscreen and back
     * @returns {Promise<void>}
     */
    async #resizeClicked() {
        // change the resize button icon to indicate the next action (fullscreen or back)
    }

    async #closeClicked() {
        await this.#popStack();
    }

    /**
     * @method #showStruct - show the dialog relative to options and set the header, main and footer as required
     * @param struct
     */
    async #showStruct(struct) {

    }

    /**
     * @method #popStack - pop the stack and show the next struct.
     * If the stack is empty, hide the dialog.
     */
    async #popStack() {
        this.#stack.pop();

        if (this.#stack.length == 0) {
            return await crs.call("dialog", 'force_close', {});
        }

        const struct = this.#stack[this.#stack.length - 1];
        await this.#showStruct(struct);
    }

    /**
     * @method #show - show the dialog content as defined by header, main and footer and options.
     * @param header - the header content
     * @param main - the main content
     * @param footer - the footer content
     * @param options - the options for the dialog (target, position, anchor, size)
     * @returns {Promise<void>}
     */
    async show(header, main, footer, options) {
        const struct = { header, main, footer, options };
        this.#stack.push(struct);

        await this.#showStruct(struct);
    }
}

customElements.define('dialog-component', Dialog);