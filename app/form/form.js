import "../../components/masked-input/masked-input.js"

export default class Form extends crs.classes.BindableElement {
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