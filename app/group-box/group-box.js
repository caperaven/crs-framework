import "/components/group-box/group-box.js";
import AvailableSelectedViewModel from "../available-selected/available-selected.js";

export default class GroupBoxViewModel extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async connectedCallback() {
        await super.connectedCallback();
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
    }

}