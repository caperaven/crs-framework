import "./../../components/combo-box/combo-box.js";

export default class ComboboxViewModel extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    get hasStyle() {
        return false;
    }
}