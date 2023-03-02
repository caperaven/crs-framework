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
    #clickHandler = this.#click.bind(this);
    #actions = Object.freeze({
        "close": this.#closeClicked.bind(this),
        "resize": this.#resizeClicked.bind(this),
    });

    /**
     * @constructor
     */
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    /**
     * @method connectedCallback - called when the element is added to the DOM.
     * @returns {Promise<void>}
     */
    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(response => response.text());
        await this.load();
        await crs.call("component", "notify_ready", {element: this});
    }

    /**
     * @method load - load the component and it's dependencies including events
     * @returns {Promise<unknown>}
     */
    load() {
        return new Promise(async resolve => {
            this.shadowRoot.addEventListener("click", this.#clickHandler);
            resolve();
        });
    }

    /**
     * @method disconnectedCallback - called when the element is removed from the DOM.
     * @returns {Promise<void>}
     */
    async disconnectedCallback() {
        this.shadowRoot.removeEventListener("click", this.#clickHandler);
        this.#clickHandler = null;
        await crsbinding.translations.delete("dialog");
    }

    /**
     * This is called externally to dispose of the component.
     * clean all internal data and remove all event listeners.
     */
    dispose() {
        this.#stack = null;
        this.remove();
    }

    /**
     * @method click - handle click events
     * @param event
     * @returns {Promise<void>}
     */
    async #click(event) {
        const action = event.target.dataset.action;
        this.#actions[action]?.(event);
    }

    /**
     * @method #resizeClicked - show resize dialog by toggling fullscreen and back
     * @returns {Promise<void>}
     */
    async #resizeClicked() {
        // toggle the fullscreen class
        this.classList.toggle("fullscreen");

        const icon = this.classList.contains("fullscreen") ? "close-fullscreen" : "open-fullscreen";
        this.shadowRoot.querySelector("#btnResize").textContent = icon;

        const method = this.classList.contains("fullscreen") ? "disable_move" : "enable_move";
        const popup = this.shadowRoot.querySelector(".popup");
        await crs.call("dom_interactive", method, {
            element: popup,
            move_query: "header"
        });
    }

    async #closeClicked() {
        await this.#popStack();
    }

    /**
     * @method #showStruct - show the dialog relative to options and set the header, main and footer as required
     * @param struct
     */
    async #showStruct(struct) {
        const {header, main, footer, options} = struct;

        await crs.call("component", "on_ready", {
            element: this,
            caller: this,
            callback: async () => {
                await this.#setHeader(header, options);
                await this.#setFooter(footer);
                await this.#setBody(main);
                await this.#setOptions(options);

                requestAnimationFrame(async () => {
                    this.#setPosition(options);
                });
            }
        });
    }

    async #setOptions(options) {
        if (options?.allowMove === true && options?.showHeader === true) {
            const popup = this.shadowRoot.querySelector(".popup");
            await crs.call("dom_interactive", "enable_move", {
                element: popup,
                move_query: "header"
            });
        }

        this.dataset.allowMove = options?.allowMove === true ? "true" : "false";
        this.dataset.allowResize = options?.allowResize === true ? "true" : "false";

        if (options?.clickOutsideToClose === true) {
            const backLayer = await crs.call("dom", "create_element", {
                tag_name: "div",
                classes: ["back"],
                attributes: {
                    "id": "back-layer",
                    "data-action": "close"
                }
            });
            this.shadowRoot.appendChild(backLayer);
        }

        if (options?.minWidth != null) {
            this.style.setProperty("--min-width", options.minWidth);
        }

        if (options?.minHeight != null) {
            this.style.setProperty("--min-height", options.minHeight);
        }
    }

    /**
     * @method push - set the content of the dialog header
     * @param header
     * @param title
     * @returns {Promise<void>}
     */
    async #setHeader(header, options) {
        const headerElement = this.shadowRoot.querySelector("header");

        if (options?.showHeader === false) {
            headerElement.innerHTML = "";
            return;
        }

        if (options?.severity != null) {
            headerElement.dataset.severity = options.severity;
        }

        if (header != null) {
            headerElement.replaceChildren(header);
            return;
        }

        const translations = {
            "title": options?.title ?? "",
            "close": options?.closeText ?? "Close",
            "resize": options?.resizeText ?? "Resize"
        }
        await crsbinding.translations.add(translations, "dialog");
        await crsbinding.translations.parseElement(headerElement);
    }

    /**
     * @method #setBody - set the content of the dialog body
     * @param body
     * @returns {Promise<void>}
     */
    async #setBody(body) {
        if (body == null) return;

        const bodyElement = this.shadowRoot.querySelector("#body");

        if (typeof body == "string") {
            bodyElement.textContent = body;
            return;
        }

        bodyElement.innerHTML = "";
        bodyElement.appendChild(body);
    }

    /**
     * @method #setFooter - set the content of the dialog footer
     * @param footer
     * @returns {Promise<void>}
     */
    async #setFooter(footer) {
        const footerElement = this.shadowRoot.querySelector("footer");
        footerElement.innerHTML = "";

        if (footer != null) {
            footerElement.appendChild(footer);
        }
    }

    /**
     * @method #setPosition - set the position of the dialog relative to target or center screen
     * @param options
     * @returns {Promise<*>}
     */
    async #setPosition(options) {
        const popup = this.shadowRoot.querySelector(".popup");

        if (options?.target == null) {
            return await crs.call("fixed_position", "set", {element: popup, position: "center-screen", margin: 10});
        }

        await crs.call("fixed_layout", "set", {
            target: options.target,
            element: popup,
            at: options.position.toLowerCase(),
            anchor: options.anchor.toLowerCase(),
            margin: options.margin
        })
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
        const struct = {header, main, footer, options};
        this.#stack.push(struct);
        await this.#showStruct(struct);
    }

    async close() {
        await this.#popStack();
    }
}

customElements.define('dialog-component', Dialog);