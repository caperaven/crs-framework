class Dialogs extends crs.classes.BindableElement {
    #dialogs = {};
    #transforms = {};

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return false;
    }

    /**
     * @method showDialog - show a dialog
     * @param id {string} - The id of the dialog
     * @param content {string} - The header, main and footer of the dialog
     * @param options {Object} - The options for the dialog
     * @param context {Object} - The binding context
     * @returns {Promise<void>}
     */
    async showDialog(id, content, options, context) {
        const dialog = this.#dialogs[id];
        if (dialog == null) return;

        // 1. check if you already have this dialog.
        // 2. if yes, close that dialog.
        if (await dialog.canClose()) {
            dialog.remove();
        }

        // 3. create a new dialog with that id
        const newDialog = this.#dialogs[id] = document.createElement("crs-dialog");
        newDialog.style.translate = "-10000px -10000px";
        newDialog.style.opacity = "0";

        this.appendChild(newDialog);
        await newDialog.initialize(content, options, context);
    }

    /**
     * @method closeDialog - close a dialog
     * @param id {string} - The id of the dialog
     * @returns {Promise<void>}
     */
    async closeDialog(id) {
        const dialog = this.#dialogs[id];
        if (dialog == null) return;

        // 1. check if the dialog can be closed.
        // 2. if yes, close the dialog.
        if (await dialog.canClose()) {
            dialog.remove();
        }
    }

    /**
     * @method pin - pin a dialog
     * @param id
     * @returns {Promise<void>}
     */
    async pin(id) {
        const dialog = this.#dialogs[id];
        if (dialog == null) return;

        dialog.pinned = true;
        const aabb = dialog.getBoundingClientRect();

        this.#transforms[id] = {
            x: Math.round(aabb.x),
            y: Math.round(aabb.y),
            width: Math.round(aabb.width),
            height: Math.round(aabb.height)
        }
    }

    /**
     * @method unpin - unpin a dialog
     * @param id {string} - The id of the dialog
     * @returns {Promise<void>}
     */
    async unpin(id) {
        const dialog = this.#dialogs[id];
        if (dialog == null) return;

        dialog.pinned = false;
        delete this.#transforms[id];
    }
}

customElements.define("crs-dialogs", Dialogs);