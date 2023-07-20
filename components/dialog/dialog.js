import {loadHTML} from "./../../src/load-resources.js";

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
 * 10. Allow auto close on click outside of container.
 *
 * Stack Features:
 * 1. Allow push and pop of stack.
 * 2. Allow custom header, footer and content.
 * 3. Stack can have a custom size and the container needs to resize accordingly.
 *
 * Action Features:
 * If you have buttons that needs particular implementation, you can add it as a data-action attribute.
 * The callback will be called where the action property defines the attribute value.
 * This allows you to close the dialog with a close button but also do something like "apply"
 * See the filter-extension in the data table for an example.
 */
export class Dialog extends HTMLElement {
    #stack = [];
    #clickHandler = this.#click.bind(this);
    #actions = {
        "close": this.#closeClicked.bind(this),
        "resize": this.#resizeClicked.bind(this),
    };

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
        this.shadowRoot.innerHTML = await loadHTML(import.meta.url);
        await this.load();
        await crs.call("component", "notify_ready", {element: this});
    }

    /**
     * @method load - load the component and it's dependencies including events
     * @returns {Promise<unknown>}
     */
    load() {
        return new Promise(resolve => {
            this.shadowRoot.addEventListener("click", this.#clickHandler);
            resolve();
        });
    }

    /**
     * @method disconnectedCallback - called when the element is removed from the DOM.
     * @returns {Promise<void>}
     */
    async disconnectedCallback() {
        const popup = this.shadowRoot.querySelector(".popup");
        await crs.call("dom_interactive", "disable_move", {
            element: popup
        });

        this.shadowRoot.removeEventListener("click", this.#clickHandler);
        this.#clickHandler = null;
        await crs.binding.translations.delete("dialog");
        this.#stack = null;

        for (const key of Object.keys(this.#actions)) {
            this.#actions[key] = null;
        }

        this.#actions = null;
    }

    /**
     * @method click - handle click events using a convention of data-action="actionName"
     * @param event
     * @returns {Promise<void>}
     */
    async #click(event) {
        const target = event.composedPath()[0];
        const action = target.dataset.action;

        // 1. no action to perform so get out
        if (action == null) return;

        // 2. this is a predefined action like close or resize
        // do that and then get out
        if (this.#actions[action] != null) {
            return this.#actions[action](event);
        }

        const struct = this.#stack[this.#stack.length - 1];

        // 3. this is a custom action so call the callback if it exists
        struct.action = action;
        struct.event = event;

        try {
            await struct.options.callback?.(struct);
        } finally {
            delete struct.action;
            delete struct.event;
        }
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
        this.className = "hidden";
        this.style.opacity = 0;
        setTimeout(async () => {
            await this.#popStack();
        }, 350);
    }

    /**
     * @method #showStruct - show the dialog relative to options and set the header, main and footer as required
     * @param struct
     */
    async #showStruct(struct) {
        return new Promise(async resolve => {
            const {header, main, footer, options} = struct;

            await crs.call("component", "on_ready", {
                element: this,
                caller: this,
                callback: async () => {
                    await this.#setHeader(header, options);
                    await this.#setFooter(footer);
                    await this.#setBody(main);
                    await this.#setOptions(options);

                    // Set position is called after the content is rendered in the dialog.
                    requestAnimationFrame(async () => {
                        await this.#setPosition(options);
                        this.className = "visible"
                        this.style.opacity = 1;
                        resolve();
                    });
                }
            });
        });
    }

    /**
     * @method #setOptions - set the options for the dialog
     * @param options {object} - the options to set
     * @param options.allowMove {boolean} - allow the dialog to be moved
     * @param options.allowResize {boolean} - allow the dialog to be resized
     * @param options.autoClose {boolean} - allow the dialog to be closed by clicking outside the dialog on a back layer
     * @param options.minWidth {string} - the minimum width of the dialog, used to control resize min width
     * @param options.minHeight {string} - the minimum height of the dialog, used to control resize min height
     * @returns {Promise<void>}
     */
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

        if (options?.autoClose === true) {
            const backLayer = await crs.call("dom", "create_element", {
                tag_name: "div",
                classes: ["back"],
                id: "back-layer",
                dataset: {
                    "action": "close"
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
            const clonedFragment = header.cloneNode(true);
            headerElement.replaceChildren(clonedFragment);
        }

        const translations = {
            "title": options?.title ?? "",
            "close": options?.closeText ?? "Close",
            "resize": options?.resizeText ?? "Resize"
        }
        await crs.binding.translations.add(translations, "dialog");
        await crs.binding.translations.parseElement(headerElement);
    }

    /**
     * @method #setBody - set the content of the dialog body
     * @param body
     * @returns {Promise<void>}
     */
    async #setBody(body) {
        if (body == null) return;

        let bodyElement = this.querySelector("[slot=body]");

        if (bodyElement == null) {
            bodyElement = document.createElement("div");
            bodyElement.setAttribute("slot", "body");
            this.appendChild(bodyElement);
        } else {
            //NOTE: doing this to stop new content appending onto child dialog
            bodyElement.replaceChildren();
        }

        if (typeof body == "string") {
            bodyElement.textContent = body;
            return;
        }

        const clone = body.cloneNode(true);
        bodyElement.appendChild(clone);
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
            return await crs.call("fixed_position", "set", {element: popup, container: options?.parent, position: "center-screen", margin: 10});
        }

        await crs.call("fixed_layout", "set", {
            target: options.target,
            element: popup,
            container: options.parent,
            at: options.position.toLowerCase(),
            anchor: options.anchor.toLowerCase(),
            margin: options.margin
        });
    }

    /**
     * @method #popStack - pop the stack and show the next struct.
     * If the stack is empty, hide the dialog.
     */
    async #popStack() {
        const removedStruct = this.#stack.pop();
        removedStruct.action = "close";
        removedStruct.options.callback && removedStruct.options.callback(removedStruct);

        if (this.#stack.length === 0) {
            return await crs.call("dialog", "force_close", {});
        }

        const struct = this.#stack[this.#stack.length - 1];
        await this.#showStruct(struct);

        return true;
    }

    /**
     * @method #show - show the dialog content as defined by header, main and footer and options.
     * @param header - the header content
     * @param main - the main content
     * @param footer - the footer content
     * @param options - the options for the dialog (target, position, anchor, size)
     * @returns {Promise<void>}
     */
    async show(header, main, footer, options, context) {
        const struct = {header, main, footer, options};
        this.#stack.push(struct);
        this.style.opacity = 0;
        setTimeout(async () => {
            await this.#showStruct(struct);
        }, 350);

        if (context != null) {
            await crs.binding.parsers.parseElements(this.children, context);
        }

        if (options?.callback != null && options.callback !== false) {
            struct.action = "loaded";
            await options.callback(struct);
            delete struct.action;
        }
    }

    /**
     * @method close - Public close method to allow the dialog to be closed from external code.
     * This will be needed in instances where a dialog has no close buttons on it.
     * @returns {Promise<void>}
     */
    async close() {
        for (const child of this.children) {
            await crs.binding.utils.unmarkElement(child);
        }

        return await this.#popStack();
    }
}

customElements.define('dialog-component', Dialog);