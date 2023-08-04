import "./../../components/overflow-bar/overflow-bar.js";

export default class OverflowBarViewModel extends crs.classes.BindableElement {
    get html() { return import.meta.url.replace(".js", ".html"); }
    get shadowDom() { return true; }
}