import "./../../components/file-uploader/file-uploader.js"
import "./../../components/file-uploader/file-uploader-actions.js"

export default class FileUploaderViewModel extends crsbinding.classes.ViewBase {
    #workingExample;
    #uploadExample;
    #uploadingExample;
    #uploadedExample;
    #downloadHandler = this.#download.bind(this);
    #replaceHandler = this.#replace.bind(this);
    #deleteHandler = this.#delete.bind(this);
    #uploadHandler = this.#upload.bind(this);
    #readyHandler = this.#initialiseComponent.bind(this);
    #timeoutId;
    #file;

    constructor() {
        super();

        globalThis.translations ||= {};

        globalThis.translations.fileUploader = {
            "upload": "Upload File",
            "dragDrop": "Or drag and drop a file here",
            "fileSize": "File Size",
            "replace": "Replace",
            "download": "Download",
            "delete": "Delete"
        }
    }

    async connectedCallback() {
        await super.connectedCallback();

        this.#workingExample = document.querySelector("#working-example");
        this.#workingExample.addEventListener("ready", this.#readyHandler);
        this.#workingExample.addEventListener("download_file", this.#downloadHandler);
        this.#workingExample.addEventListener("replace_file", this.#replaceHandler);
        this.#workingExample.addEventListener("delete_file", this.#deleteHandler);
        this.#workingExample.addEventListener("upload_file", this.#uploadHandler);

        this.#uploadExample = document.querySelector("#upload");
        this.#uploadingExample = document.querySelector("#uploading");
        this.#uploadedExample = document.querySelector("#uploaded");

        this.#uploadExample.addEventListener("ready", this.#readyHandler);
        this.#uploadingExample.addEventListener("ready", this.#readyHandler);
        this.#uploadedExample.addEventListener("ready", this.#readyHandler);
    }

    async disconnectedCallback() {
        this.#workingExample.removeEventListener("ready", this.#readyHandler);
        this.#workingExample.removeEventListener("download_file", this.#downloadHandler);
        this.#workingExample.removeEventListener("replace_file", this.#replaceHandler);
        this.#workingExample.removeEventListener("delete_file", this.#deleteHandler);
        this.#workingExample.removeEventListener("upload_file", this.#uploadHandler);

        this.#uploadExample.removeEventListener("ready", this.#readyHandler);
        this.#uploadingExample.removeEventListener("ready", this.#readyHandler);
        this.#uploadedExample.removeEventListener("ready", this.#readyHandler);

        this.#downloadHandler = null;
        this.#replaceHandler = null;
        this.#deleteHandler = null;
        this.#uploadHandler = null;
        this.#readyHandler = null;

        this.#uploadExample = null ;
        this.#uploadingExample = null ;
        this.#uploadedExample = null ;
        this.#workingExample = null;

        clearTimeout(this.#timeoutId);
        this.#timeoutId = null;
        this.#file = null;

        await super.disconnectedCallback();
    }

    async #initialiseComponent(event) {
        if (event.target.id === "working-example") {
            await crs.call("file_uploader_component", "initialize", {
                element: this.#workingExample,
                drag_target: "#target",
            }, this.element);
        }

        if (event.target.id === "upload") {
            await crs.call("file_uploader_component", "initialize", {
                element: this.#uploadExample,
            });
        }

        if (event.target.id === "uploading") {
            await crs.call("file_uploader_component", "initialize", {
                element: this.#uploadingExample,
                file_name: "uploading",
                file_extension: "txt",
                file_size: 1000
            });
            this.#uploadingExample.dataset.state = "uploading";
        }

        if (event.target.id === "uploaded") {
            await crs.call("file_uploader_component", "initialize", {
                element: this.#uploadedExample,
                file_name: "uploaded",
                file_extension: "pdf",
                file_size: 5000
            });
        }
    }

    async #upload(event) {
        console.log("file upload started");
        this.#file = event.detail.file;

        if (this.#timeoutId == null) {
            this.#timeoutId = setTimeout(() => {
                this.#fileUploaded();
            }, 3000);
        }
    }

    async #replace(event) {
        console.log("replacing file", event.detail.file);
        this.#file = event.detail.file;

        await crs.call("file_uploader_component", "uploading_file", {
            element: this.#workingExample,
            file: this.#file,
            file_name: this.#file.name,
            file_extension: this.#file.ext
        });

        if (this.#timeoutId == null) {
            this.#timeoutId = setTimeout(() => {
                this.#fileUploaded();
            }, 2500);
        }
    }

    async #fileUploaded() {
        console.log("file uploaded", this.#file);

        clearTimeout(this.#timeoutId);
        this.#timeoutId = null;

        //call upon the api function to alert the input the file has been uploaded
        await crs.call("file_uploader_component", "file_uploaded", {
            element: this.#workingExample
        });
    }

    async #download(event) {
        console.log("downloading file", "\nevent.detail.file:", event.detail.file, "\nfile on view:", this.#file);
    }

    async #delete(event) {
        console.log("deleting file");
        const fileOnView = this.#file;

        await crs.call("file_uploader_component", "file_deleted", {
            element: this.#workingExample
        });
        this.#file = null;

        console.log("file deleted", "\nevent.detail.file:", event.detail.file, "\nfile on view:", fileOnView);

    }
}