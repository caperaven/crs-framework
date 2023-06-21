import "../../components/masked-input/masked-input.js"
import AvailableSelectedViewModel from "../available-selected/available-selected.js";

export default class FormViewModel extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    preLoad() {
        crs.binding.translations.add({
            firstName: "First Name",
            lastName: "Last Name",
            duration: "Duration",
            phone: "Phone"
        }, "form")
    }
}