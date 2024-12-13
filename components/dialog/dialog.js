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
import {calculatePosition} from "./dialog-utils.js";


export class Dialog extends HTMLElement {
    #stack = [];
    #clickHandler = this.#click.bind(this);
    #mouseUpHandler = this.#mouseUp.bind(this);
    #mouseDownHandler = this.#mouseDown.bind(this);
    #actions = {
        "close": this.#closeClicked.bind(this),
        "resize": this.#resizeClicked.bind(this),
        "popout": this.#popoutClicked.bind(this)
    };
    #tooltipIcon;
    #popup;
    #cachedTranslatePosition;
    #cachedWidth;

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
        return new Promise(resolve => {
            this.shadowRoot.addEventListener("click", this.#clickHandler);

            this.#popup = this.shadowRoot.querySelector(".popup")

            this.#popup.addEventListener("mouseup", this.#mouseUpHandler);

            this.#tooltipIcon = this.shadowRoot.querySelector("#tooltip-icon");

            this.#popup.addEventListener("mousedown", this.#mouseDownHandler);
            resolve();
        });
    }

    /**
     * @method disconnectedCallback - called when the element is removed from the DOM.
     * @returns {Promise<void>}
     */
    async disconnectedCallback() {
        await crs.call("dom_interactive", "disable_move", {
            element: this.#popup
        });

        this.shadowRoot.removeEventListener("click", this.#clickHandler);
        this.#popup.removeEventListener("mouseup", this.#mouseUpHandler);
        this.#popup.removeEventListener("mousedown", this.#mouseDownHandler);

        this.#clickHandler = null;
        await crsbinding.translations.delete("dialog");
        this.#stack = null;
        this.#tooltipIcon = null;
        this.#cachedTranslatePosition = null;
        this.#popup = null;
        this.#mouseUpHandler =null;
        this.#mouseDownHandler = null;
        this.#cachedWidth = null;
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

        // 3. this is a custom action so call the callback if it exists
        const struct = this.#stack[this.#stack.length - 1];

        struct.action = action;
        struct.event = event;

        try {
            await struct.options.callback?.(struct);
        } finally {
            delete struct.action;
            delete struct.event;
        }
    }

    async #mouseDown(event) {
        const isHidden = this.#tooltipIcon.getAttribute("hidden");

        if (isHidden === "true") return;

        this.#tooltipIcon.dataset.visible = "false";
        this.#cachedTranslatePosition = this.#popup.style.translate;
        this.#cachedWidth = this.#popup.style.width;
    }

    async #mouseUp(event) {
        const isHidden = this.#tooltipIcon.getAttribute("hidden");

        if (isHidden === "true") return;

        const position  = this.#popup.style.translate;
        const width = this.#popup.style.width;

        if(position !== this.#cachedTranslatePosition || width !== this.#cachedWidth) {
            this.#tooltipIcon.setAttribute("hidden", "true");
            return;
        }

        this.#tooltipIcon.dataset.visible = "true";
    }

    /**
     * @method #resizeClicked - show resize dialog by toggling fullscreen and back
     * @returns {Promise<void>}
     */
    async #resizeClicked(event) {
        const parentElement = event.composedPath()[0].parentElement;
        // toggle the fullscreen class
        this.classList.toggle("fullscreen");

        const icon = this.classList.contains("fullscreen") ? "close-fullscreen" : "open-fullscreen";
        this.shadowRoot.querySelector("#btnResize").textContent = icon;

        await this.#disableMouseMove(parentElement);
    }

    async #popoutClicked(event) {
        const popoutButton = event.composedPath()[0];
        const parentElement = popoutButton.parentElement;

        this.classList.toggle("popout");
        //Todo: change the icon name when bringing in the correct icons
        const popoutIcon = this.classList.contains("popout") ? "pop-out-close" : "pop-out";
        const tooltip = this.classList.contains("popout") ? "Expand": "Collapse";// Todo convert to translations.
        await this.#disableMouseMove(parentElement);
        popoutButton.textContent = popoutIcon;
        popoutButton.setAttribute("tooltip", tooltip);
    }

    async #closeClicked() {
        await this.#popStack();
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
     * @param options.maxWidth {string} - the maximum width of the dialog, used to control resize max width
     * @param options.maxHeight {string} - the maximum height of the dialog, used to control resize max height
     * @param options.allowMaximize {boolean} - allow the dialog to be shown in full screen
     * @param options.allowPopout {boolean} - allow the dialog to be shown in a medium screen size
     * @param options.allowFormatting {string} - allow the dialog to format the content
     * @returns {Promise<void>}
     */
    async #setOptions(options) {
        if (options?.allowMove === true && options?.showHeader === true) {
            await crs.call("dom_interactive", "enable_move", {
                element: this.#popup,
                move_query: "header"
            });
        }

        this.dataset.allowMove = options?.allowMove === true ? "true" : "false";
        this.dataset.allowResize = options?.allowResize === true ? "true" : "false";
        this.dataset.allowMaximize = options?.allowMaximize === true ? "true" : "false";
        this.dataset.allowPopout = options?.allowPopout === true ? "true" : "false";// Todo: cml simplify please - this is not needed
        this.dataset.format = options?.allowFormatting;

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

        if (options?.maxWidth != null) {
            this.style.setProperty("--max-width", options.maxWidth);
        }

        if (options?.maxHeight != null) {
            this.style.setProperty("--max-height", options.maxHeight);
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

        let bodyElement = this.querySelector("[slot=body]");

        if (bodyElement == null) {
            bodyElement = document.createElement("div");
            bodyElement.setAttribute("slot", "body");
            this.appendChild(bodyElement);
        }

        if (typeof body == "string") {
            bodyElement.textContent = body;
            return;
        }

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
            this.dataset.hasFooter = "true";
            footerElement.appendChild(footer);
        }
    }

    /**
     * @method #setPosition - set the position of the dialog relative to target or center screen
     * @param options
     * @returns {Promise<*>}
     */
    async #setPosition(options) {
        if (options?.target == null) {
            return await crs.call("fixed_position", "set", {
                element: this.#popup,
                container: options?.parent,
                position: "center-screen",
                margin: 10
            });
        }

        const positionInfo = await crs.call("fixed_layout", "set", {
            target: options.target,
            element: this.#popup,
            container: options.parent,
            at: options.position.toLowerCase(),
            anchor: options.anchor.toLowerCase(),
            margin: options.margin
        });

        await this.#setTooltipIconPosition(options, positionInfo);
    }

    async #setTooltipIconPosition(options, positionInfo) {
        const {position, anchor, margin, parent} = options;

        if (parent.tagName.toUpperCase() !== "BODY" && parent != null) {
            this.#tooltipIcon.setAttribute("hidden", true);
        }

        let positionType = true;
        if (position !== "top" && position !== "bottom") {
            positionType = false;
        }

        this.#tooltipIcon.dataset.postion = position;
        const {xCoordinate, yCoordinate}  = await calculatePosition(positionInfo, anchor,position,margin,positionType);

        this.#tooltipIcon.dataset.position = position;
        this.#tooltipIcon.style.translate = `${xCoordinate}px ${yCoordinate}px`;
    }

    /**
     * @method #popStack - pop the stack and show the next struct.
     * If the stack is empty, hide the dialog.
     */
    async #popStack() {
        const removedStruct = this.#stack.pop();
        removedStruct.action = "close";
        removedStruct.options.callback && removedStruct.options.callback(removedStruct);

        if (this.#stack.length == 0) {
            return await crs.call("dialog", 'force_close', {});
        }

        const struct = this.#stack[this.#stack.length - 1];
        await this.#showStruct(struct);
        return true;
    }

    async #disableMouseMove(headerElement) {
        if (this.classList.contains("popout") || this.classList.contains("fullscreen")) {
            headerElement.dataset.ignore = "true";
        } else {
            delete headerElement.dataset.ignore;
        }
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
        return await this.#popStack();
    }
}

customElements.define('dialog-component', Dialog);