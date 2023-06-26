export default class WelcomeViewModel extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get hasStyle() {
        return false;
    }
}