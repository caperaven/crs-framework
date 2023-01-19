import "./../../components/file-system/file-system.js";
import "./../../components/text-editor/text-editor.js";

export default class FileSystemViewModel extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    async open() {
        await document.querySelector("file-system").selectFolder();
    }

    async filesChanged(event) {
        const text = event.detail.content || "";
        this.textEditor.value = text;
    }
}