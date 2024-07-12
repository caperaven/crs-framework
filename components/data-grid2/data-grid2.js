export default class DataGrid2 extends crs.classes.BindableElement {
    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }
}

customElements.define("data-grid2", DataGrid2);