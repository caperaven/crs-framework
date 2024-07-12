import "./../../components/data-grid2/data-grid2-actions.js";

export default class DataGrid2ViewModel extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }
}