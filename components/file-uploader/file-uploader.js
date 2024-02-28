import {get_file_name} from "./../../packages/crs-process-api/action-systems/files-actions.js";

/**
 * @class FileUploader - Responsible for uploading a file to the server
 *
 * State Management:
 * When no file is associated with the input, the component will display a button to upload a file,
 * as well as a drop target to drag and drop a file on to upload.
 *
 * Once a file has been either been dragged and dropped, or selected to be uploaded,
 * the component will display the file name, size of the file, and a button to remove the file.
 *
 * When the file is being uploaded to the server, the component will display an in-progress icon
 * giving an indication the file is being uploaded.
 *
 * If there is a file that has been uploaded and is associated with the input,
 * then the component will display the file name, size of the file, a button to download the file, and a button to remove the file.
 *
 * In summary, the component will have 4 states
 * 1. Upload state
 * 2. Uploading state
 * 3. Uploaded state
 *
 * Events:
 * onDrop - When a file is dropped onto the drag target, calls upload()
 *
 * Attributes:
 * data-state - The current state of the element (upload, uploading, uploaded)
 * data-drag-target - The element that will become the drop target for the file to be dragged and dropped onto
 *
 *
 */
export class FileUploader extends HTMLElement {
    //TODO: Add ability to rename teh file after it has been uploaded

    #input;
    #file;
    #fileNameLabel;
    #fileSizeLabel;
    #dragTarget;
    #highlightActive;
    #dropBounds;
    #clickHandler = this.click.bind(this);
    #dragOverHandler = this.#dragOver.bind(this);
    #dragLeaveHandler = this.#dragLeave.bind(this);
    #onDropHandler = this.#onDrop.bind(this);
    #uploadHandler = this.upload.bind(this);

    #states = Object.freeze({
        "UPLOAD": "upload",
        "UPLOADING": "uploading",
        "UPLOADED": "uploaded"
    })

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    static get observedAttributes() {
        return ["data-file-name", "data-file-size", "data-file-type"];
    }

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch(this.html).then(result => result.text());
        await this.load();
    }

    async disconnectedCallback() {
        if (this.dataset.dragTarget != null) {
            await this.#disableDropZone();
        }
        this.removeEventListener("click", this.#clickHandler);
        this.#input?.removeEventListener("change", this.#uploadHandler);
        this.#dragTarget?.removeEventListener("dragover", this.#dragOverHandler);
        this.#dragTarget?.removeEventListener("dragleave", this.#dragLeaveHandler)

        this.#input = null;
        this.#dragTarget = null;
        this.#highlightActive = null;
        this.#dropBounds = null;
        this.#clickHandler = null;
        this.#dragOverHandler = null;
        this.#dragLeaveHandler = null;
        this.#onDropHandler = null;
        this.#fileNameLabel = null;
        this.#fileSizeLabel = null;
        this.#uploadHandler = null;

        this.#states = null;
    }

    async load() {
        requestAnimationFrame(async () => {
            this.addEventListener("click", this.#clickHandler);

            this.#input = this.shadowRoot.querySelector("#inp-upload");
            this.#input.addEventListener("change", this.#uploadHandler);

            if (this.dataset.fileName == null && this.dataset.fileSize == null && this.dataset.fileType == null) {
                this.dataset.state = this.#states.UPLOAD;
            } else {
                this.#updateLabels();
            }

            if (this.dataset.dragTarget != null) {
                this.#dragTarget = document.querySelector(this.dataset.dragTarget);
                this.#dragTarget && await this.#enableDropZone();
            }
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "data-file-name" || name === "data-file-size" || name === "data-file-type") {
            this.#updateLabels();
            if (this.dataset.fileName != null && this.dataset.fileSize != null && this.dataset.fileType != null) {
                this.dataset.state = this.#states.UPLOADED;
            }
        }
    }

    /**
     * Click event handler - handles the click event on the component
     * If the click is on the upload button, then the upload process will be initiated
     * @param event {Event} - the click event
     * @returns {Promise<void>}
     */
    async click(event) {
        const element = event.composedPath()[0];

        if(element.dataset.action && this[element.dataset.action]) {
            await this[element.dataset.action](event);
        }
    }

    async upload(event) {
        const file = this.#input.files[0];
        const fileDetails = await get_file_name(file.name);

        await this.#uploadFile({
            name: fileDetails.name,
            ext: fileDetails.ext,
            type: file.type,
            size: file.size,
            value: file
        })
    }

    async uploaded() {
        this.dataset.state = this.#states.UPLOADED;
    }

    async replace() {
        //TODO: show warning dialog with message: "Are you sure you want to replace the file? All historic data will still remain."

        const result = await crs.call("files", "load", {
            dialog: true,
        });

        await this.#uploadFile(result[0]);
    }

    async cancel(event) {
        this.dataset.state = this.#states.UPLOAD;
        this.dispatchEvent(new CustomEvent("change", {detail: {element: this, file: null, action: "cancel"}}));

        /*
            TODO KR: What happens when a file was already uploaded, we replace it, and then cancel the upload?
            OK will need to pick up the cancel event, there will most likely be some file ID associated with the component
            that can be used to retrieve the original associated file and then hand that back to the component via the file-uploader-actions system
         */
    }

    async download() {
        this.dispatchEvent(new CustomEvent("download_file", {detail: {
            element: this,
            file: this.#file
        }}));
    }

    async delete(event) {

    }

    /**
     * Enable the drop zone for the file to be dragged and dropped onto
     * @returns {Promise<void>}
     */
    async #enableDropZone() {
        await crs.call("files", "enable_dropzone", {
            element: this.#dragTarget,
            handler: this.#onDropHandler
        })

        this.#dragTarget.addEventListener("dragover", this.#dragOverHandler);
        this.#dragTarget.addEventListener("dragleave", this.#dragLeaveHandler)
    }

    /**
     * Disables the drop zone
     * @returns {Promise<void>}
     */
    async #disableDropZone() {
        await crs.call("files", "disable_dropzone", {
            element: this.#dragTarget
        });
        await crs.call("dom_interactive", "remove_animation_layer");
        this.#highlightActive = false;
    }

    /**
     * Drag over event handler - handles the drag over event on the drag target
     * If the drag target is dragged over, the drop target will be highlighted
     * @returns {Promise<void>}
     */
    async #dragOver(){
        if (this.#highlightActive !== true) {
            const dropTemplate = this.shadowRoot.querySelector("#drop-template");
            await crs.call("dom_interactive", "highlight", {
                target: this.#dragTarget,
                template: dropTemplate,
                classes:  ["drop-area"]
            });
            this.#highlightActive = true;
            this.#dropBounds = this.#dragTarget.getBoundingClientRect();
        }
    }

    /**
     * Drag leave event handler - handles the drag leave event on the drag target
     * If the drag target is dragged over and then dragged out, the drop target will be un-highlighted
     * @param event {Event} - the drag leave event
     * @returns {Promise<void>}
     */
    async #dragLeave(event) {
        if (event.x >= this.#dropBounds.left && event.x <= this.#dropBounds.right &&
            event.y >= this.#dropBounds.top && event.y <= this.#dropBounds.bottom) return;

        await crs.call("dom_interactive", "remove_animation_layer");
        this.#highlightActive = false;
    }

    /**
     * Drop event handler - handles the drop event on the drag target
     * If a file is dropped onto the drag target, the upload process will be initiated
     * @param event {Event} - the event containing the file to be uploaded
     * @returns {Promise<void>}
     */
    async #onDrop(event) {
        await crs.call("dom_interactive", "remove_animation_layer");
        this.#highlightActive = false;

        if (event.length > 0) {
            await this.#uploadFile(event[0]);
        }
    }

    /**
     * Upload action - initiates the upload process and updates associated elements accordingly
     * @param event {Event} - the event containing the file to be uploaded
     * @returns {Promise<void>}
     */
    async #uploadFile(file) {
        console.log("uploading file", file);
        this.#file = file;
        this.dispatchEvent(new CustomEvent("change", {detail: {element: this, file: this.#file, action: this.#states.UPLOAD}}));

        this.dataset.state = this.#states.UPLOADING;

        this.dataset.fileName = file.name;
        this.dataset.fileType = file.ext;
        this.dataset.fileSize = file.size;

        this.#updateLabels();
    }

    /**
     * Util function to convert a file size into a human-readable format
     * @param size
     * @returns {string}
     */
    #fileToSize(size) {
        let divisor = 1024;
        let suffixes = ["Kb", "Mb", "Gb", "Tb"];
        let value = 1, suffix = "Kb";

        for (let i = 0; i < 4; i++) {
            if ((size / divisor) < 1) break;
            value = size / divisor;
            suffix = suffixes.shift();
            divisor *= 1024;
        }

        const fract = suffix == "Kb" ? 0 : 2;
        return `${value.toFixed(fract)}${suffix}`;
    }

    /**
     * Updates the file name and size labels
     */
    #updateLabels() {
        this.#fileNameLabel = this.#fileNameLabel || this.shadowRoot.querySelector("#lbl-file-name");
        this.#fileSizeLabel = this.#fileSizeLabel || this.shadowRoot.querySelector("#lbl-file-size");

        let fileName;
        if (this.dataset.fileType?.includes(".")) {
            fileName = `${this.dataset.fileName}${this.dataset.fileType}`
        } else {
            `${this.dataset.fileName}.${this.dataset.fileType}`
        }

        this.#fileNameLabel.innerText = fileName;
        this.#fileSizeLabel.innerText = this.#fileToSize(this.dataset.fileSize);
    }

    setState(args) {
        if (args.state == null) return;
        this.dataset.state = args.state;
        this.dataset.fileName = args.fileName;

    }
}


customElements.define("file-uploader", FileUploader)