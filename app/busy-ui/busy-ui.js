import "./../../components/busy-ui/busy-ui-actions.js";

export default class BusyUIViewModel extends crsbinding.classes.ViewBase {
    #hasBusy = false;
    async connectedCallback() {
        await super.connectedCallback();
    }

    async loadBusy() {
        if (this.#hasBusy === false) {
            await crs.call("busy_ui", "show", {
                "element": this.container,
                "message": "Loading..."
            })

            this.#hasBusy = true;
        }
        else {
            await crs.call("busy_ui", "hide", {
                "element": this.container
            })

            this.#hasBusy = false;
        }

    }
}