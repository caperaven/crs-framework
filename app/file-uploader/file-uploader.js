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

    async #upload(event) {
        console.log("file upload started");
        this.#file = event.detail.file;

        if (this.#timeoutId == null) {
            debugger;
            this.#timeoutId = setTimeout(() => {
                this.#fileUploaded();
            }, 3000);
        }
    }

    async #replace(event) {
        console.log("replacing file", event.detail.file);
        this.#file = event.detail.file;

        await crs.call("file_uploader", "replace_file", {
            element: this.#workingExample,
            file: this.#file,
            file_name: this.#file.name,
            file_extension: this.#file.ext
        });

        if (this.#timeoutId == null) {
            debugger;
            this.#timeoutId = setTimeout(() => {
                this.#fileUploaded();
            }, 3000);
        }
    }

    async #fileUploaded() {
        console.log("file uploaded", this.#file);

        clearTimeout(this.#timeoutId);
        this.#timeoutId = null;

        //call upon the api function to alert the input the file has been uploaded
        await crs.call("file_uploader", "file_uploaded", {
            element: this.#workingExample
        });
    }

    async #cancel() {
        clearTimeout(this.#timeoutId);
        this.#timeoutId = null;

        console.log("file upload cancelled")
    }

    async #download(event) {
        console.log("downloading file", "\nevent.detail.file:", event.detail.file, "\nfile on view:", this.#file);
    }

    async #delete(event) {
        console.log("deleting file");
        const fileOnView = this.#file;

        await crs.call("file_uploader", "file_deleted", {
            element: this.#workingExample
        });
        this.#file = null;

        console.log("file deleted", "\nevent.detail.file:", event.detail.file, "\nfile on view:", fileOnView);

    }
}