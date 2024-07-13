import "./../../components/data-grid2/data-grid2-actions.js";

export default class DataGrid2ViewModel extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async load() {
        const grid = this.shadowRoot.querySelector("data-grid2");
        await crs.call("datagrid2", "initialize", { element: grid });
    }
}