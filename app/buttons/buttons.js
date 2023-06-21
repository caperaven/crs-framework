import AvailableSelectedViewModel from "../available-selected/available-selected.js";

export default class ButtonsViewModel extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }
}