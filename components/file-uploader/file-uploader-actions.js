/**
 * @class FileUploaderActions - class to interface with the file-uploader component
 *
 * Features:
 * - get_file: retrieves the file off the file-uploader component, and sets it to a target if specified.
 * - file_uploaded: calls upon the uploaded function on the element to notify the component the file has been uploaded
 * - file_deleted: calls upon the deleted function on the element to notify the component the file has been deleted
 * - replace_file: request to the component to replace the current file associated to the component, providing a new file, file name, and file extension.
 * - file_replaced: calls upon the uploaded function on the element to notify the component the file has been replaced
 * - upload_file:
 * - download_file:
 */
export class FileUploaderActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    /**
     * @function get_file - retrieves the file off the file-uploader component
     *
     * @param step {Object} - The step object in the process.
     * @param context {Object} - The context of the current process.
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

    /**
     * @function file_uploaded - calls upon the uploaded function on the element to notify the component the file has been uploaded
     *
     * @param step {Object} - The step object from the process definition
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The process object that is currently running.
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.element {String || HTMLElement} - The element to call the uploaded function on.
     *
     * @returns {Promise<void>}
     */
    static async file_uploaded(step, context, process, item) {
        const element = await crs.dom.get_element(step, context, process, item);

        await element.uploaded();
    }

    /**
     * @function file_deleted - calls upon the deleted function on the element to notify the component the file has been deleted
     *
     * @param step {Object} - The step object from the process definition
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The process object that is currently running.
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.element {String || HTMLElement} - The element to call the uploaded function on.
     *
     * @returns {Promise<void>}
     */
    static async file_deleted(step, context, process, item) {
        const element = await crs.dom.get_element(step, context, process, item);

        await element?.deleted();
    }

    /**
     * @function replace_file - request to the component to replace the current file associated to the component.
     * Updates the fileName and fileExtension properties on the element if specified.
     *
     * @param step {Object} - The step object from the process definition
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The process object that is currently running.
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.element {String || HTMLElement} - The element to call the uploaded function on.
     * @param step.args.file {File} - The file to replace the current file with.
     * @param step.args.file_name {String} - The name of the file to update the component with.
     * @param step.args.file_extension {String} - The extension of the file to update the component with.
     *
     * @returns {Promise<void>}
     */
    static async replace_file(step, context, process, item) {
        const element = await crs.dom.get_element(step, context, process, item);
        const fileName = await crs.process.getValue(step.args.file_name, context, process, item) || element.dataset.fileName;
        const fileExtension = await crs.process.getValue(step.args.file_extension, context, process, item) || element.dataset.fileType;

        element.file = await crs.process.getValue(step.args.file, context, process, item);

        await element.updateDatasetProperties("uploading", fileName, fileExtension, element.file.size);
        await element.updateLabels();
    }

    /**
     * @function file_replaced - calls upon the uploaded function on the element to notify the component the file has been replaced
     *
     * @param step {Object} - The step object from the process definition
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The process object that is currently running.
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.element {String || HTMLElement} - The element to call the uploaded function on.
     * @param step.args.file {File} - The file to replace the current file with.
     *
     * @returns {Promise<void>}
     */
    static async file_replaced(step, context, process, item) {
        const element = await crs.dom.get_element(step, context, process, item);
        const file = await crs.process.getValue(step.args.file, context, process, item);

        await element.uploaded(file);
    }

    static async upload_file(step, context, process, item) {
        const element = await crs.dom.get_element(step, context, process, item);
        const file = await crs.process.getValue(step.args.file, context, process, item);

        file != null && await element.upload(file);
    }

    static async download_file(step, context, process, item) {
        const element = await crs.dom.get_element(step, context, process, item);

        element.file != null && await element.download();
    }

    static async delete_file(step, context, process, item) {
        const element = await crs.dom.get_element(step, context, process, item);

        await element.delete();
    }
}

crs.intent.file_uploader = FileUploaderActions;