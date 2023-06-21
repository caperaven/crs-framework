import "./../../components/text-editor/text-editor.js";
import TabListViewModel from "../tab-list/tab-list.js";

export default class TextEditorViewModel extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }
}