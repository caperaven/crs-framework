import "./../../components/dialog/dialog-actions.js";
import "./../../components/calendar/calendar.js";

export default class Dialog extends crsbinding.classes.ViewBase {
    #anchor = {
        left: "top",
        right: "top",
        bottom: "left",
    }

    async connectedCallback() {
        await super.connectedCallback();
    }

    async disconnectedCallback() {
        for (const key of Object.keys(this.#anchor)) {
            this.#anchor[key] = null;
        }
        this.#anchor = null;
        await super.disconnectedCallback();
    }

    async show() {
        const instance = this._element.querySelector("#dialog-content").content.cloneNode(true);

        await crs.call("dialog", "show", {
            title: "My Title",
            main: instance,
            parent: "main"
        });
    }

    async showRelative(event) {
        const instance = this._element.querySelector("#dialog-content").content.cloneNode(true);
        const position = document.querySelector("#positionOptions").value;

        await crs.call("dialog", "show", {
            title: "My Title",
            main: instance,
            target: event.target,
            position: position,
            anchor: this.#anchor[position],
            margin: 10,
            parent: "main"
        });
    }

    async showParentDialog(event) {
        const instance = this._element.querySelector("#nested-dialog").content.cloneNode(true);
        const position = document.querySelector("#positionOption").value;

        const header = await crs.call("dom", "create_element", {
            tag_name: "template",
            children: [
                {
                    tag_name: "h2",
                    text_content: "&{dialog.title}"
                },
                {
                    tag_name: "button",
                    text_content: "open-fullscreen",
                    classes: ["icon", "transparent"],
                    attributes: {
                        id: "btnResize",
                        "data-action": "resize",
                        "aria-label": "&{en.resize}"
                    }
                },
                {
                    tag_name: "button",
                    text_content: "close",
                    classes: ["icon", "transparent"],
                    attributes: {
                        id: "btnClose",
                        "data-action": "close",
                        "aria-label": "&{en.close}"
                    }
                }
            ]
        });
        await crs.call("dialog", "show", {
            main: instance,
            title: "My Parent Dialog",
            target: event.target,
            position: position,
            anchor: this.#anchor[position],
            margin: 10,
            parent: "main",
            header: header.content
        });
    }

    async #showChildDialog() {
        const instance = this._element.querySelector("#child-dialog").content.cloneNode(true);

        const header = await crs.call("dom", "create_element", {
            tag_name: "template",
            children: [
                {
                    tag_name: "h2",
                    text_content: "&{dialog.title}"
                },
                {
                    tag_name: "button",
                    text_content: " open-fullscreen",
                    classes: ["icon", "transparent"],
                    attributes: {
                        id: "btnResize",
                        "data-action": "resize",
                        "aria-label": "&{en.resize}"
                    }
                },
                {
                    tag_name: "button",
                    text_content: "close",
                    classes: ["icon", "transparent"],
                    attributes: {
                        id: "btnClose",
                        "data-action": "close",
                        "aria-label": "&{en.close}"
                    }
                }
            ]
        });

        await crs.call("dialog", "show", {
            main: instance,
            parent: "main",
            title: "My Child Dialog",
            header: header.content,
            close: false
        });
    }

    async handleMessage(event) {
        const target = event.target;
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

        let position = this.element.querySelector("#position").value;

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
            target: event.target,
            auto_close: true,
            min_width: "22rem",
            min_height: "25rem"
        });
    }
}