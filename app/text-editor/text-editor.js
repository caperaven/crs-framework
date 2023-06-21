import "./../../components/text-editor/text-editor.js";

export default class TextEditor extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }
}