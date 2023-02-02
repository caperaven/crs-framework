import "./dialog.js";

/**
 * @class DialogActions - Actions for the dialog component executed from the process api.
 *
 * Actions:
 * 1. defineSizes - define the sizes for the dialog and is called during initial application setup.
 * 2. show - show the dialog.
 * 3. force_close - force close the dialog regardless of what is in it.
 */
class DialogActions {
    /**
     * @method defineSizes - define the sizes for the dialog and is called during initial application setup.
     * @param step {object} - the process step.
     * @param context {object} - the binding context.
     * @param process {object} - the current process.
     * @param item {object} - the current item in the process if in a loop.
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * await crs.call("dialog", "defineSizes", {
     *     "auto": {
     *         "width": "max-content",
     *         "height": "max-content"
     *     },
     *     "small": {
     *         "width": "300px",
     *         "height": "max-content"
     *     },
     *     "medium": {
     *         // I don't know the size yet, but call this function to calculate the size.
     *         "callback": () => { width: "500px", height: "800px" },
     *     }
     * });
     */
    static async defineSizes(step, context, process, item) {
        globalThis.dialogSizes ||= {};
        Object.assign(globalThis.dialogSizes, step.args);
    }

    /**
     * @method show - show the dialog.
     * @param step {object} - the process step.
     * @param context {object} - the binding context.
     * @param process {object} - the current process.
     * @param item {object} - the current item in the process if in a loop.
     *
     * @param step.args.header {HTMLElement} - the header element to show in the dialog header.
     * @param step.args.main {HTMLElement} - the main element to show as the dialog main content.
     * @param step.args.footer {HTMLElement} - the footer element to show in the dialog footer, normally toolbar actions.
     *
     * Optional:
     * @param step.args.target {HTMLElement} - the element to show the dialog relative to this target, if not defined it shows in the middle of screen.
     * @param step.args.position {string} - the position of the dialog relative to the target element -
     * only required if you have defined a target.
     * options are: "left", "right", "top", "bottom"
     *
     * @param step.args.anchor {string} - the anchor of the dialog relative to the target element - only required if you have defined a target.
     * options are: "left", "right", "top", "bottom"
     *
     * @param step.args.size {string} - the size of the dialog - based on the sizes registered with the defineSizes action.
     * Use the key of the size. "auto" is default even if not defined.
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * await crs.call("dialog", "show", {
     *     // optional
     *     target: document.querySelector("#myElement"),
     *     position: "left",
     *     anchor: "top",
     *     size: "auto",
     *
     *     // required
     *     header: headerElement - if null, default header is shown.
     *     main: mainElement - required
     *     footer: footerElement - if null, footer is hidden.
     *
     *     // optional
     *     title: "My Title" - used instead of the header element as an alternative
     *     close: true - by default this is true and the old dialog is closed and a new one opened..
     *     if close is false, the new content is added to the stack and closing the dialog will return to the previous one.
     * })
     *
     * @example <caption>json example</caption>
     * {
     *    "type": "dialog",
     *    "action": "show",
     *    "args": {
     *        "target": "$context.target",
     *        "position": "left",
     *        "anchor": "top",
     *        "size": "auto",
     *
     *        "header": "$context.header",
     *        "main": "$context.main",
     *        "footer": "$context.footer",
     *    }
     */
    static async show(step, context, process, item) {
        const headerElement = await crs.process.getValue(step.args.header, context, process, item);
        const mainElement = await crs.process.getValue(step.args.main, context, process, item);
        const footerElement = await crs.process.getValue(step.args.footer, context, process, item);

        // optional
        // if we are on mobile, ignore these options.
        // todo: check for mobile
        const target = await crs.process.getValue(step.args.target, context, process, item);
        const position = await crs.process.getValue(step.args.position, context, process, item);
        const anchor = await crs.process.getValue(step.args.anchor, context, process, item);
        const size = await crs.process.getValue(step.args.size, context, process, item);
        const close = await crs.process.getValue(step.args.close ?? true, context, process, item);

        const options = {target, position, anchor, size};

        const dialog = await ensureDialog(close);
        dialog.show(headerElement, mainElement, footerElement, options);
    }

    /**
     * Force close the dialog and all of it's content by removing it from the dom
     * @param step  - the process step.
     * @param context - the binding context.
     * @param process - the current process.
     * @param item - the current item in the process if in a loop.
     * @returns {Promise<void>}
     */
    static async force_close(step, context, process, item) {
        if (globalThis.dialog) {
            globalThis.dialog = globalThis.dialog.dispose();
        }
    }
}

async function ensureDialog(close) {
    if (close == true) {
        await crs.call("dialog", "force_close", {});
    }

    if (!globalThis.dialog) {
        globalThis.dialog = document.createElement('dialog-component');
        document.body.appendChild(globalThis.dialog);
    }

    return globalThis.dialog;
}

crs.intent.dialog = DialogActions;