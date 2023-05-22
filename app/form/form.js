import "../../components/masked-input/masked-input.js"

export default class Form extends crs.binding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
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