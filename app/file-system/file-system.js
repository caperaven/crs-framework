import "./../../components/file-system/file-system.js";
import "./../../components/text-editor/text-editor.js";

export default class FileSystemViewModel extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async open() {
        await document.querySelector("file-system").selectFolder();
    }

    async filesChanged(event) {
        const text = event.detail.content || "";
        this.textEditor.value = text;
    }
}