import "/components/checkbox/checkbox.js";

export default class Checkbox extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async preLoad() {
        this.setProperty("isActive", true);
        this.setProperty("isTrue", null);
    }

    async mixed() {
        this.cbMixed.checked = "mixed";
    }
}