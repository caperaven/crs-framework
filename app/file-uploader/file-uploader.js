import "./../../components/file-uploader/file-uploader.js"
import "./../../components/file-uploader/file-uploader-actions.js"

export default class FileUploaderViewModel extends crsbinding.classes.ViewBase {
    #workingExample;
    #workingExampleChangeHandler = this.#change.bind(this);
    #timeoutId;
    #file;

    async connectedCallback() {
        await super.connectedCallback();
        this.#workingExample = document.querySelector("#working-example");
        this.#workingExample.addEventListener("change", this.#workingExampleChangeHandler);
    }

    async disconnectedCallback() {
        this.#workingExample.removeEventListener("change", this.#workingExampleChangeHandler);
        this.#workingExample = null;
        this.#workingExampleChangeHandler = null;
        clearTimeout(this.#timeoutId);
        this.#timeoutId = null;
        this.#file = null;

        await super.disconnectedCallback();
    }

    async #change(event) {
        //set a 10 second timeout to simulate a file upload

        const action = event?.detail?.action;
        action != null && this[action] != null && await this[action](event);

        if (event.detail.action == "upload") {

        }

        if (event.detail.action == "cancel") {

        }

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

    async upload() {
        if (this.#timeoutId == null) {
            debugger;
            this.#timeoutId = setTimeout(() => {
                this.#fileUploaded(event);
            }, 5000);
        }
    }

    async cancel() {
        clearTimeout(this.#timeoutId);
        this.#timeoutId = null;

        console.log("file upload cancelled")
    }
}