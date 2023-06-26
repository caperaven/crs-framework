import "./../../components/combo-box/combo-box.js";

export default class ComboboxViewModel extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get hasStyle() {
        return false;
    }

    async preLoad() {
        await this.setProperty("selected1", "test_2");
    }
}