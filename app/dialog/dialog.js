import "./../../components/dialog/dialog-actions.js";

export default class Dialog extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    async show() {
        const instance = this._element.querySelector("#dialog-content").content.cloneNode(true);

        await crs.call("dialog", "show", {
            title: "My Title",
            main: instance
        });
    }

    async showRelative(event) {
        const instance = this._element.querySelector("#dialog-content").content.cloneNode(true);
        const position = document.querySelector("#positionOptions").value;

        const anchor = {
            left: "top",
            right: "top",
            bottom: "left",
        }

        await crs.call("dialog", "show", {
            title: "My Title",
            main: instance,
            target: event.target,
            position: position,
            anchor: anchor[position],
            margin: 10
        });
    }

    async error(target, args) {
        await crs.call("dialog", "show", args);
    }

    async info(target, args) {
        await crs.call("dialog", "show", args);
    }

    async warning(target, args) {
        await crs.call("dialog", "show", args);
    }


    async handleMessage(event) {
        const target = event.target;
        const action = target.dataset.action;
        if (action == null) return;

        const footerFragment = document.createDocumentFragment();
        await crs.call("dom", "create_element", {
            tag_name: "button",
            classes: ["secondary"],
            text_content: "Cancel",
            parent: footerFragment,
            attributes: {
                "data-action": "close"
            }
        });
        await crs.call("dom", "create_element", {
            tag_name: "button",
            classes: ["primary"],
            text_content: "Accept",
            parent: footerFragment
        });


        const args = {
            title: action,
            main: `This is an ${action} message`,
            type: action,
            footer: footerFragment
        }

        let position = this.element.querySelector("#position").value;
        const anchor = {
            left: "top",
            right: "top",
            bottom: "left",
        }

        if (position != "none") {
            Object.assign(args, {
                target: target,
                position: position,
                anchor: anchor[position],
                margin: 10
            })
        }

        await this[action](target, args);
    }
}