import "/components/checkbox/checkbox.js";
import AvailableSelectedViewModel from "../available-selected/available-selected.js";

export default class CheckboxViewModel extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async preLoad() {
        this.setProperty("isActive", true);
        this.setProperty("isTrue", null);
    }

    async mixed() {
        this.cbMixed.checked = "mixed";
    }
}