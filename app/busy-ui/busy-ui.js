import "./../../components/busy-ui/busy-ui-actions.js";
import AvailableSelectedViewModel from "../available-selected/available-selected.js";

export default class BusyUIViewModelViewModel extends crs.classes.BindableElement {
    #hasBusy = "";

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async connectedCallback() {
        await super.connectedCallback();
    }

    async loadBusy() {
        if (this.#hasBusy === "updated") {
            await crs.call("busy_ui", "hide", {
                "element": this.container
            })

            this.#hasBusy = false;
            return;
        }

        if (this.#hasBusy !== "start") {
            await crs.call("busy_ui", "show", {
                "element": this.container,
                "message": "Loading...",
                "progress": "loaded 0 out of 100"
            })

            this.#hasBusy = "start";
            return;
        }

        if (this.#hasBusy === "start") {
            await crs.call("busy_ui", "update", {
                "element": this.container,
                "message": "Loading... updated",
                "progress": "loaded 50 out of 100"
            })

            this.#hasBusy = "updated";
            return;
        }
    }
}