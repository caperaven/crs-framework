import "./../../components/dialog/dialog-actions.js";
import "./../../components/calendar/calendar.js";
import AvailableSelectedViewModel from "../available-selected/available-selected.js";

export default class DialogViewModel extends crs.classes.BindableElement {
    #anchor = {
        left: "top",
        right: "top",
        bottom: "left",
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async disconnectedCallback() {
        for (const key of Object.keys(this.#anchor)) {
            this.#anchor[key] = null;
        }
        this.#anchor = null;
        await super.disconnectedCallback();
    }

    async show() {
        const instance = this.shadowRoot.querySelector("#dialog-content").content.cloneNode(true);

        await crs.call("dialog", "show", {
            title: "My Title",
            main: instance,
            parent: "main",
            modal: false
        });
    }

    async showRelative(event) {
        const instance = this.shadowRoot.querySelector("#dialog-content").content.cloneNode(true);
        const position = this.shadowRoot.querySelector("#positionOptions").value;

        await crs.call("dialog", "show", {
            title: "My Title",
            main: instance,
            target: event.composedPath()[0],
            position: position,
            anchor: this.#anchor[position],
            margin: 10,
            parent: "main"
        });
    }

    async showParentDialog(event) {
        const instance = this.shadowRoot.querySelector("#nested-dialog").content.cloneNode(true);
        const position = this.shadowRoot.querySelector("#positionOption").value;
        const header = this.shadowRoot.querySelector("#custom-header").content.cloneNode(true);

        await crs.call("dialog", "show", {
            title: "My Parent Dialog",
            main: instance,
            target: event.composedPath()[0],
            position: position,
            anchor: this.#anchor[position],
            margin: 10,
            parent: "main",
            header: header,
            callback: async (args) => {
                if (args.action === "openDialog") {
                    await this.#showChildDialog();
                }
            }
        });
    }

    async #showChildDialog() {
        const instance = this.shadowRoot.querySelector("#child-dialog").content.cloneNode(true);
        const header = this.shadowRoot.querySelector("#custom-header").content.cloneNode(true);

        await crs.call("dialog", "show", {
            title: "My Child Dialog",
            main: instance,
            parent: "main",
            header: header,
            close: false
        });
    }

    async handleMessage(event) {
        const target = event.composedPath()[0];
        const action = target.dataset.action;
        if (action == null) return;

        const footerTemplate = await crs.call("dom", "create_element", {
            tag_name: "template",
            children: [
                {
                    tag_name: "button",
                    classes: ["secondary"],
                    text_content: "Cancel",
                    attributes: {
                        "data-action": "close"
                    }
                },
                {
                    tag_name: "button",
                    classes: ["primary"],
                    text_content: "Accept"
                }
            ]
        });

        const args = {
            title: action,
            main: `This is an ${action} message`,
            severity: action,
            footer: footerTemplate.content.cloneNode(true),
            allow_resize: false,
            parent: "main"
        }

        let position = this.shadowRoot.querySelector("#position").value;

        if (position != "none") {
            Object.assign(args, {
                target: target,
                position: position,
                anchor: this.#anchor[position],
                margin: 10
            })
        }

        await crs.call("dialog", "show", args);
    }

    async customHeader() {
        const headerTemplate = await crs.call("dom", "create_element", {
            tag_name: "template",
            children: [
                {
                    tag_name: "h2",
                    text_content: "Custom Header"
                },
                {
                    tag_name: "button",
                    text_content: "globe-alt",
                    classes: ["icon"]
                },
                {
                    tag_name: "button",
                    text_content: "close",
                    classes: ["icon"],
                    attributes: {
                        "data-action": "close"
                    }
                }
            ]
        });

        await crs.call("dialog", "show", {
            title: "My Title",
            main: "Test",
            header: headerTemplate.content.cloneNode(true),
            parent: "main",
            allow_move: false
        });
    }

    async noHeader(event) {
        const calendar = document.createElement("calendar-component");
        calendar.setAttribute("id", "calendar-component");
        calendar.dataset.start = "2023-01-15";

        await crs.call("dialog", "show", {
            main: calendar,
            show_header: false,
            parent: "main",
            position: "bottom",
            anchor: "left",
            target: event.composedPath()[0],
            auto_close: true,
            min_width: "22rem",
            min_height: "25rem"
        });
    }
}