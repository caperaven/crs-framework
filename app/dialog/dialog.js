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
}