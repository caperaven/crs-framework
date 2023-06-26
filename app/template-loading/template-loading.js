import TabListViewModel from "../tab-list/tab-list.js";

export default class TemplateLoadingViewModel extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get hasStyle() {
        return false;
    }
}