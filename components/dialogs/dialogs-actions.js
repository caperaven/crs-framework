import "./crs-dialog/crs-dialog.js";
import "./crs-dialogs/dialogs.js";

class DialogsActions {

    /**
     * @method show - show a dialog
     * @param step {Object} - The step object
     * @param context {Object} - The binding context
     * @param process {Object} - The process object
     * @param item {Object} - The item object
     *
     * @returns {Promise<void>}
     *
     * @example <caption>javascript</caption>
     * await crs.call("dialogs", "show", {
     *     id: "my-dialog",
     *     context: {
     *         header: headerElement,
     *         main: mainElement,
     *         footer: footerElement
     *     },
     *     options: {
     *         modal: false, // I have access to what is behind me. (designer)
     *         auto_hide: false, // default true, to hide when a new dialog is shown.
     *         remember_position: true // default false, to remember the position of the dialog.
     *        ... options settings
     *     }
     * })
     */
    static async show(step, context, process, item) {
        const id = await crs.process.getValue(step.args.id, context, process, item);
        const content = await crs.process.getValue(step.args.content, context, process, item);
        const options = await crs.process.getValue(step.args.options, context, process, item);

        await crs.dialogs.showDialog(id, content, options, context);
    }


    /**
     * @method close - close an open dialog based on the id
     * @param step {Object} - The step object
     * @param context {Object} - The binding context
     * @param process {Object} - The process object
     * @param item {Object} - The item object
     *
     * @param {string} id - The id of the dialog to close
     *
     * @returns {Promise<void>}
     *
     * @example <caption>javascript</caption>
     * await crs.call("dialogs", "show", {
     *     id: "my-dialog"
     * })
     */
    static async close(step, context, process, item) {
        const id = await crs.process.getValue(step.args.id, context, process, item);
        await crs.dialogs.closeDialog(id);
    }

    /**
     * @method pin - used when you "Pin" the dialog in place
     * @param step {Object} - The step object
     * @param context {Object} - The binding context
     * @param process {Object} - The process object
     * @param item {Object} - The item object
     * @returns {Promise<void>}
     *
     * @example <caption>javascript</caption>
     * await crs.call("dialogs", "pin", {
     *     id: "my-dialog"
     * })
     */
    static async pin(step, context, process, item) {
        const id = await crs.process.getValue(step.args.id, context, process, item);
        await crs.dialogs.pin(id);
    }

    /**
     * @method unpin
     * @param step {Object} - The step object
     * @param context {Object} - The binding context
     * @param process {Object} - The process object
     * @param item {Object} - The item object
     * @returns {Promise<void>}
     *
     * @example <caption>javascript</caption>
     * await crs.call("dialogs", "unpin", {
     *     id: "my-dialog"
     * })
     */
    static async unpin(step, context, process, item) {
        const id = await crs.process.getValue(step.args.id, context, process, item);
        await crs.dialogs.unpin(id);
    }
}

crs.dialogs = document.createElement("crs-dialogs");
document.body.appendChild(crs.dialogs);
crs.intent.dialogs = DialogsActions;