import "./../../components/file-uploader/file-uploader.js"
import "./../../components/file-uploader/file-uploader-actions.js"

export default class FileUploaderViewModel extends crsbinding.classes.ViewBase {
    #workingExample;
    #downloadHandler = this.#download.bind(this);
    #replaceHandler = this.#replace.bind(this);
    #cancelHandler = this.#cancel.bind(this);
    #deleteHandler = this.#delete.bind(this);
    #uploadHandler = this.#upload.bind(this);
    #timeoutId;
    #file;

    async connectedCallback() {
        await super.connectedCallback();
        this.#workingExample = document.querySelector("#working-example");
        this.#workingExample.addEventListener("download_file", this.#downloadHandler);
        this.#workingExample.addEventListener("cancel_upload", this.#cancelHandler);
        this.#workingExample.addEventListener("replace_file", this.#replaceHandler);
        this.#workingExample.addEventListener("delete_file", this.#deleteHandler);
        this.#workingExample.addEventListener("upload_file", this.#uploadHandler);
    }

    async disconnectedCallback() {
        this.#workingExample.removeEventListener("download_file", this.#downloadHandler);
        this.#workingExample.removeEventListener("cancel_upload", this.#cancelHandler);
        this.#workingExample.removeEventListener("replace_file", this.#replaceHandler);
        this.#workingExample.removeEventListener("delete_file", this.#deleteHandler);
        this.#workingExample.removeEventListener("upload_file", this.#uploadHandler);

        this.#downloadHandler = null;
        this.#cancelHandler = null;
        this.#replaceHandler = null;
        this.#deleteHandler = null;
        this.#uploadHandler = null;

        this.#workingExample = null;
        clearTimeout(this.#timeoutId);
        this.#timeoutId = null;
        this.#file = null;

        await super.disconnectedCallback();
    }

    async #fileUploaded() {
        console.log("file uploaded")

        clearTimeout(this.#timeoutId);
        this.#timeoutId = null;

        //call upon the api function to alert the input the file has been uploaded
        await crs.call("file_uploader_actions", "file_uploaded", {
            element: this.#workingExample
        });
    }

    async #upload() {
        if (this.#timeoutId == null) {
            debugger;
            this.#timeoutId = setTimeout(() => {
                this.#fileUploaded(event);
            }, 5000);
        }
    }

    async #cancel() {
        clearTimeout(this.#timeoutId);
        this.#timeoutId = null;

        console.log("file upload cancelled")
    }

    async #download() {
        console.log("file downloaded")
    }

    async #replace() {
        console.log("replacing file")
    }

    async #delete() {
        console.log("deleting file")
    }
}