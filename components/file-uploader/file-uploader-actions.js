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

    static async upload_file(step, context, process, item) {

    }

    static async file_uploaded(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);

        await element.uploaded();
    }

    static async download_file(step, context, process, item) {

    }

    static async cancel_upload(step, context, process, item) {

    }

    static async delete_file(step, context, process, item) {

    }

    static async get_file_info(step, context, process, item) {

    }

    static async set_file_info(step, context, process, item) {

    }
}

crs.intent.file_uploader_actions = FileUploaderActions;