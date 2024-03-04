/**
 * @class FileUploaderActions - class to interface with the file-uploader component
 *
 * Features:
 * - upload_file:
 * - file_uploaded:
 * - download_file:
 * - cancel_upload:
 * - delete_file:
 * - get_file_info:
 * - set_file_info:
 */
export class FileUploaderActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    /**
     * @function get_file - retrieves the file off the file-uploader component
     * @param step {Object} - The step object in the process.
     * @param context {Object} - The context object.
     * @param process {Object} - The currently running process.
     * @param item {Object} - The item object if we are using a loop.
     *
     * @param step.args.element {String || HTMLElement} - The element to get the file from.
     * @param step.args.target {String} - The target to set the file to.
     *
     * @returns {Promise<*>}
     */
    static async get_file(step, context, process, item) {
        const element = await crs.dom.get_element(step, context, process, item);
        const file = element?.file;

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, file, context, process, item);
        }

        return file;
    }

    static async file_uploaded(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);

        await element.uploaded();
    }

    static async file_deleted(step, context, process, item) {
        const element = await crs.dom.get_element(step, context, process, item);

        await element?.deleted();
    }

    static async replace_file(step, context, process, item) {
        const element = await crs.dom.get_element(step, context, process, item);
        const fileName = await crs.process.getValue(step.args.file_name, context, process, item);
        const fileExtension = await crs.process.getValue(step.args.file_extension, context, process, item);

        element.file = await crs.process.getValue(step.args.file, context, process, item);

        await element.updateDatasetProperties("uploading", fileName, fileExtension, element.file.size);
        await element.updateLabels();
    }

    static async file_replaced(step, context, process, item) {
        const element = await crs.dom.get_element(step, context, process, item);
        const file = await crs.process.getValue(step.args.file, context, process, item);

        await element.uploaded(file);
    }

    static async upload_file(step, context, process, item) {

    }

    static async download_file(step, context, process, item) {

    }

    static async cancel_upload(step, context, process, item) {

    }

    static async set_file_info(step, context, process, item) {

    }
}

crs.intent.file_uploader = FileUploaderActions;