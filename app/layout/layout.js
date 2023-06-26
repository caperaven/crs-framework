import "../../components/layout-container/layout-container.js";
import AvailableSelectedViewModel from "../available-selected/available-selected.js";

export default class LayoutViewModel extends crs.classes.BindableElement {
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