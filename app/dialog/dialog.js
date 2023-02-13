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

    async showError(target, position, anchor) {
        const div = await crs.call("dom", "create_element", {
            "tag_name": "div",
            "text_content": "My cool message"
        });

        const args = {
            title: "Could not update Work Order",
            main: div,
            severity: "error"
        }

        if (position != null) {
            Object.assign(args, {
                target: target,
                position: position,
                anchor: anchor,
                margin: 2
            });
        }

        await crs.call("dialog", "show_severity", args);
    }

    async showInfo(target, position, anchor) {

    }

    async showWarning(target, position, anchor) {

    }


    async handleMessage(event) {
        const target = event.target;
        const action = target.dataset.action;
        if (action == null) return;

        const anchor = {
            left: "top",
            right: "top",
            bottom: "left",
        }

        let position = this.element.querySelector("#position").value;
        position = position === "none" ? null : position;
        await this[action](target, position, anchor[position]);
    }
}