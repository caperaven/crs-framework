import {get_file_name} from "./../../packages/crs-process-api/action-systems/files-actions.js";

/**
 * @class FileUploader - Responsible for uploading a file to the server
 *
 * State Management:
 * Initially the component is in the upload state.When no file is associated with the input,
 * the component will display a button to upload a file.
 * If a drag target has been specified via the data-drag-target attribute,
 * the component will allow the user to drag and drop a file onto the drag target.
 *
 * Once a file has either been dragged and dropped, or selected to be uploaded,
 * the component will display the file name, size of the file, and a button to remove the file,
 * and moves into the uploading state.
 * When the file is being uploaded to the server, the component will display an in-progress icon
 * giving an indication the file is being uploaded. If the user would like to cancel the uploading process
 * they can click the cancel button.
 *
 * If there is a file that has been uploaded and is associated with the input, then the component will display the file name,
 * size of the file, a button to download the file, and a button to remove the file, and remains in the uploaded state.
 * If the user selects the delete button the component emits a delete_file event, and once confirmation has been received
 * that the delete has been processed outside the component, the component will reset back to the upload state.
 *
 * If there is a file that has been uploaded and is associated with the input, and the user chooses to replace the file,
 * the component emits a replace_file event with the new file. Once confirmation has been received that the file can be replaced,
 * the component will move into an uploading state.
 * Once the file has been replaced, the component will move back into the uploaded state.
 *
 *
 * States:
 * 1. Upload state - no file has been associated with the input
 * 2. Uploading state - a file has been associated with the input and is being uploaded to the server
 * 3. Uploaded state - a file has been associated with the input and has successfully been uploaded to the server
 *
 *
 * Events:
 * click - When the user clicks a child element of the component, the click event will be picked up via the clickHandler.
 *         Based on the data-action attribute of the child element, the corresponding action will be called.
 *         data-actions supported: cancel, delete, download, replace
 * change - When the user clicks on the btn-upload label, the input[type='file'] element will be triggered to open the file dialog
 *          This process is managed by the changeHandler
 * upload_file - When a file has been selected to be uploaded, the upload_file event will be emitted with the file
 *               and the component as the detail
 * replace_file - When the user chooses to replace a file, the replace_file event will be emitted with the new file selected
 * cancel_upload - If the user chooses to cancel the uploading of a file, the cancel_upload event will be emitted
 * download_file - If the user chooses to download the file, the download_file event will be emitted with the file
 *                 and the component as the detail
 *
 *
 * Attributes:
 * data-state - The current state of the element (upload, uploading, uploaded)
 * data-drag-target - The element that will become the drop target for the file to be dragged and dropped onto
 * data-file-name - The name of the file associated with the input
 * data-file-size - The size of the file associated with the input
 * data-file-type - The type(extension) of the file associated with the input
 *
 * TODO - KR
 * - Add ability to rename the file after it has been uploaded
 */
export class FileUploader extends HTMLElement {

    #input;
    #dropBounds;
    #dragTarget;
    #fileNameLabel;
    #fileSizeLabel;
    #highlightActive;
    #clickHandler = this.#click.bind(this);
    #changeHandler = this.#change.bind(this);
    #dragEventHandler = this.#processDragEvent.bind(this);

    #states = Object.freeze({
        "UPLOAD": "upload",
        "UPLOADING": "uploading",
        "UPLOADED": "uploaded"
    })

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    static get observedAttributes() {
        return ["data-file-name", "data-file-size", "data-file-type", "dataset-state"];
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
        this.#input?.removeEventListener("change", this.#changeHandler);

        this.#input = null;
        this.#dropBounds = null;
        this.#dragTarget = null;
        this.#fileNameLabel = null;
        this.#fileSizeLabel = null;
        this.#highlightActive = null;
        this.#clickHandler = null;
        this.#changeHandler = null;
        this.#dragEventHandler = null;

        this.#states = null;

        this.file = null;
    }

    async load() {
        requestAnimationFrame(async () => {
            this.addEventListener("click", this.#clickHandler);

            this.#input = this.shadowRoot.querySelector("#inp-upload");
            this.#input.addEventListener("change", this.#changeHandler);

            if (this.dataset.fileName == null && this.dataset.fileSize == null && this.dataset.fileType == null && this.dataset.state == null) {
                this.dataset.state = this.#states.UPLOAD;
            } else {
                this.updateLabels();
            }

            if (this.dataset.dragTarget != null) {
                this.#dragTarget = document.querySelector(this.dataset.dragTarget);
                this.#dragTarget && await this.#enableDropZone();
            }
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "data-file-name" || name === "data-file-size" || name === "data-file-type") {
            this.updateLabels();
        }

        if (name === "data-state") {
            this.dataset.state = newValue;
        }
    }

    /**
     * Click event handler - handles the click event on the component
     * If the click is on the upload button, then the upload process will be initiated
     * @param event {Event} - the click event
     * @returns {Promise<void>}
     */
    async #click(event) {
        const element = event.composedPath()[0];

        if(element.dataset.action && this[element.dataset.action]) {
            await this[element.dataset.action](event);
        }
    }

    /**
     * Change event handler - handles the change event on the input[type='file'] element which is triggered when the user
     * clicks on the btn-upload label and selects a file to be uploaded.
     * @returns {Promise<void>}
     */
    async #change() {
        const file = this.#input.files[0];
        const fileDetails = await get_file_name(file.name);

        await this.#upload({
            name: fileDetails.name,
            ext: fileDetails.ext,
            type: file.type,
            size: file.size,
            value: file
        })
    }

    /**
     * Enable the drop zone for the file to be dragged and dropped onto
     * @returns {Promise<void>}
     */
    async #enableDropZone() {
        await crs.call("files", "enable_dropzone", {
            element: this.#dragTarget,
            callback: this.#dragEventHandler
        })
    }

    /**
     * Disables the drop zone and cleans up the animation layer
     * @returns {Promise<void>}
     */
    async #disableDropZone() {
        await crs.call("files", "disable_dropzone", {
            element: this.#dragTarget
        });
        await this.#removeAnimationLayer();
    }

    /**
     * Removes the animation layer from the drop zone and sets the highlightActive flag to false
     * @returns {Promise<void>}
     */
    async #removeAnimationLayer() {
        await crs.call("dom_interactive", "remove_animation_layer");
        this.#highlightActive = false;
    }

    /**
     * Based on the event action (dragOver, dragLeave, drop) that comes back from the files action system,
     * the corresponding action will be called and processed.
     * @param args {Object} - the event action and the event results
     * @param args.action {String} - the action to be processed (dragOver, dragLeave, drop)
     * @param args.event {Event} - the event that has been triggered
     * @param args.results {Array} - the results of the event that has been triggered
     * @returns {Promise<void>}
     */
    async #processDragEvent(args) {
        if (args.action === "dragOver") {
            await this.#dragOver();
        }

        if (args.action === "dragLeave") {
            await this.#dragLeave(args.event);
        }

        if (args.action === "drop") {
            await this.#onDrop(args.results);
        }
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

        await this.#removeAnimationLayer();
    }

    /**
     * Drop event handler - handles the drop event on the drag target
     * If a file is dropped onto the drag target and there is no file associated with the input,
     * then the file will be uploaded.
     * If there is a file associated with the input,
     * then the file will be replaced
     * @param event {Array} - the event containing the file to be uploaded
     * @returns {Promise<void>}
     */
    async #onDrop(event) {
        await this.#removeAnimationLayer();

        if (this.file == null) {
            if (event.length > 0) {
                await this.#upload(event[0]);
            }
        }
        else {
            await this.replace(event);
        }
    }

    /**
     * Upload action - initiates the upload process and updates associated properties and child elements accordingly
     * @param file {Object} - the file to be uploaded
     * @returns {Promise<void>}
     */
    async #upload(file) {
        this.file = file;
        this.dispatchEvent(new CustomEvent("upload_file", {detail: {
            element: this,
            file: this.file
        }}));

        this.updateDatasetProperties(this.#states.UPLOADING, this.file.name, this.file.ext, this.file.size);
        this.updateLabels();
    }

    /**
     * Util function to convert a file size into a human-readable format
     * @param size {Number} - the size of the file
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
     * Util function to compose the full file name based on the file name and file type parameters
     * @param fileName {String} - the name of the file
     * @param fileType {String} - the type(extension) of the file
     * @returns {string}
     */
    #getFileName(fileName, fileType) {
        if (fileType?.includes(".")) {
            return `${fileName}${fileType}`
        } else {
            return `${fileName}.${fileType}`
        }
    }

    async uploaded(file) {
        this.dataset.state = this.#states.UPLOADED;

        if (file != null) {
            this.file = file;
        }
    }

    async replace(event) {
        if (event.type != null && event.type === "click") {
            const result = await crs.call("files", "load", {
                dialog: true,
            });
            this.file = result[0];
        }
        else if (Array.isArray(event)) {
            this.file = event[0];
        }

        this.dispatchEvent(new CustomEvent("replace_file", {detail: {
                element: this,
                file: this.file
            }}));
    }

    async delete(event) {
        this.dispatchEvent(new CustomEvent("delete_file", {detail: {
                element: this,
                file: this.file
            }}));
    }

    async deleted() {
        this.#input.value = null;
        this.dataset.state = this.#states.UPLOAD;
    }

    async cancel(event) {
        //if uploading for the first time and we hit cancel then we reset back to the upload state
        //if we are replacing a file and we hit cancel then we reset back to the uploaded state


        this.#input.value = null;
        this.dataset.state = this.#states.UPLOAD;

        this.dispatchEvent(new CustomEvent("cancel_upload", {detail: {
                element: this,
                file: null
            }}));
    }

    async download() {
        this.dispatchEvent(new CustomEvent("download_file", {detail: {
                element: this,
                file: this.file
            }}));
    }

    /**
     * Updates the corresponding dataset properties based on the state, name, extension, and size parameters
     * @param state {String} - the state of the element (upload, uploading, uploaded)
     * @param name {String} - the name of the file
     * @param extension {String} - the type(extension) of the file
     * @param size {Number} - the size of the file
     */
    updateDatasetProperties(state, name, extension, size) {
        this.dataset.state = state;

        this.dataset.fileName = name;
        this.dataset.fileType = extension;
        this.dataset.fileSize = size;
    }

    /**
     * Updates the file name and size labels
     */
    updateLabels() {
        this.#fileNameLabel = this.#fileNameLabel || this.shadowRoot.querySelector("#lbl-file-name");
        this.#fileSizeLabel = this.#fileSizeLabel || this.shadowRoot.querySelector("#lbl-file-size");

        if ( this.#fileNameLabel == null || this.#fileSizeLabel == null) return;

        this.#fileNameLabel.innerText = this.#getFileName(this.dataset.fileName, this.dataset.fileType);
        this.#fileSizeLabel.innerText = this.#fileToSize(this.dataset.fileSize);
    }

}


customElements.define("file-uploader", FileUploader)