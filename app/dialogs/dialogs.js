import "./../../components/dialogs/dialogs-actions.js";

export default class DialogsViewModel extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async preLoad() {
        this.setProperty("person", {
            firstName: "John",
            lastName: "Doe",
            age: 30
        })
    }

    async dialog(id) {
        const header = this.shadowRoot.querySelector("#tplHeader").content.cloneNode(true).firstElementChild;
        const body = this.shadowRoot.querySelector("#tplBody").content.cloneNode(true).firstElementChild;
        const footer = this.shadowRoot.querySelector("#tplFooter").content.cloneNode(true).firstElementChild;

        await crs.call("dialogs", "show", {
            id,
            content: {
                header, body, footer
            }
        }, this)
    }

    async cancel() {
        console.log("cancel");
    }

    async save() {
        console.log("save");
    }
}