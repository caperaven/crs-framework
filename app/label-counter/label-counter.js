import "/components/label-counter.css/label-counter.css.js"
import AvailableSelectedViewModel from "../available-selected/available-selected.js";

export default class WelcomeViewModel extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }
    get hasStyle() {
        return false;
    }

    async changed(event) {
        this.setProperty("value", event.detail.value);
    }
}