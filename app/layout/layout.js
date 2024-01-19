import "../../components/layout-container/layout-container.js";
import AvailableSelectedViewModel from "../available-selected/available-selected.js";

export default class LayoutViewModel extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

}