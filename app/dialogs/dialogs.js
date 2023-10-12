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
            },
            options: {
                modal: id == "dialog1",
                remember: true,
                headless: id == "dialog1"
            }
        }, this)
    }

    async showSubDialog() {
        const body = this.shadowRoot.querySelector("#tplSubBody").content.cloneNode(true).firstElementChild;

        await crs.call("dialogs", "show", {
            id: "sub-dialog",
            content: {
                body
            },
            options: {
                headless: true,
                auto_close: true
            }
        }, this)
    }

    async cancel(event) {
        console.log("cancel");
        const element = event.composedPath()[0];
        console.log(element);
        await crs.call("dialogs", "close", { element });
    }

    async save(event) {
        console.log("save");
        const element = event.composedPath()[0];
        console.log(element);
        await crs.call("dialogs", "close", { element });
    }

    async closeSubDialog(event) {
        const element = event.composedPath()[0];
        console.log(element);
        await crs.call("dialogs", "close", { element });
    }

    async relativeTo(event) {
        const element = event.composedPath()[0];
        const header = this.shadowRoot.querySelector("#tplHeader").content.cloneNode(true).firstElementChild;
        const body = this.shadowRoot.querySelector("#tplBody").content.cloneNode(true).firstElementChild;
        const footer = this.shadowRoot.querySelector("#tplFooter").content.cloneNode(true).firstElementChild;

        await crs.call("dialogs", "show", {
            id: "relative-dialog",
            content: {
                header, body, footer
            },
            options: {
                remember: true,
                headless: true,
                auto_close: true,
                modal: false,

                relative_to: element,
                position: "bottom",
                anchor: "left",
                margin: 10
            }
        }, this)
    }

    async maximize(event) {
        const body = document.createElement("div");
        body.style.width = "1024px";
        body.style.height = "768px";
        body.style.background = "red";

        await crs.call("dialogs", "show", {
            id: "sub-dialog",
            content: {
                body
            },
            options: {
                maximize: true
            }
        }, this)
    }
}