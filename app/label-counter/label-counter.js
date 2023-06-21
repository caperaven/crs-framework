import "/components/label-counter.css/label-counter.css.js"

export default class Welcome extends crs.classes.BindableElement {
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