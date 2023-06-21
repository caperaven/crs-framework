import "/components/combobox/combobox.js";
import AvailableSelectedViewModel from "../available-selected/available-selected.js";

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