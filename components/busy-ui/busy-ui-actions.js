import "./busy-ui.js";

/**
 * @class BusyUIActions - These actions allow you to show and hide busy indicators for different parts of the UI.
 */
export class BusyUIActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * @method show - Show a busy indicator for a specific element.
     * @param step {object} - the process step.
     * @param context {object} - the process context.
     * @param process {object} - the process.
     * @param item {object} - the process item.
     * @returns {Promise<void>}
     *
     * @param step.args.element {HTMLElement} - the element to show the busy indicator for.
     * @param step.args.message {string} - the message to show in the busy indicator.
     * @param step.args.progress {string} - the progress to show in the busy indicator.
     *
     * @example <caption>javascript example</caption>
     * await crs.call("busy_ui", "show", {
     *    "element": "#my-element",
     *    "message": "Loading..."
     * });
     *
     * @example <caption>json example</caption>
     * {
     *   "type": "busy_ui",
     *   "action": "show",
     *   "args": {
     *      "element": "#my-element",
     *      "message": "Loading..."
     *   }
     * }
     */
    static async show(step, context, process, item) {
        let element = await crs.dom.get_element(step.args.element, context, process, item);
        const message = await crs.process.getValue(step.args.message || "", context, process, item);
        const progress = await crs.process.getValue(step.args.progress || "", context, process, item);
        const showOverlay = await crs.process.getValue(step.args.show_overlay || false, context, process, item);

        if (element == null) {
            return console.error(`busy-ui, unable to find element ${step.args.element}`);
        }

        // make sure the element you are adding this too is relative or absolute.
        ensureElementRelative(element);

        // 1. if the element already has a busy indicator, don't add another one.
        element = element.shadowRoot || element;
        const hasElement = element.querySelector("busy-ui") != null;
        if (hasElement) return;

        // 2. create the busy indicator and add it to the element.
        const busyElement = document.createElement("busy-ui");
        busyElement.dataset.message = message;
        busyElement.dataset.progress = progress;

        if (showOverlay === true) {
            busyElement.classList.add("overlay");
        }

        // 3. add the busy indicator to the element.
        element.appendChild(busyElement);
    }

    static async update(step, context, process, item) {
        let element = await crs.dom.get_element(step.args.element, context, process, item);
        const message = await crs.process.getValue(step.args.message || "", context, process, item);
        const progress = await crs.process.getValue(step.args.progress || "", context, process, item);

        element = element.shadowRoot || element;
        const busyElement = element.querySelector("busy-ui");
        if (busyElement != null) {
            busyElement.dataset.message = message;
            busyElement.dataset.progress = progress;
        }
    }

    /**
     * @method hide - Hide a busy indicator for a specific element.
     * @param step {object} - the process step.
     * @param context {object} - the process context.
     * @param process {object} - the process.
     * @param item {object} - the process item.
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * await crs.call("busy_ui", "hide", {
     *   "element": "#my-element"
     * });
     */
    static async hide(step, context, process, item) {
        const fadeOut = await crs.process.getValue(step.args.fade_out || false, context, process, item);
        const busyElement = element.querySelector("busy-ui");
        let element = await crs.dom.get_element(step.args.element, context, process, item);

        element = element.shadowRoot || element;
        if (busyElement) {
            if (fadeOut === true) {
                await waitForFadeOut(busyElement);
            }
            busyElement.remove();
        }
    }
}

function ensureElementRelative(element) {
    const styles = window.getComputedStyle(element);
    const position = styles.getPropertyValue("position");

    if (position !== "relative" && position !== "absolute") {
        element.style.position = "relative";
    }
}

function waitForFadeOut(element) {
    return new Promise(resolve => {
        element.style.opacity = 0;
        setTimeout(() => {
            resolve();
        }, 500);
    })
}

crs.intent.busy_ui = BusyUIActions;