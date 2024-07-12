export default class DataGrid2Cells extends crs.classes.BindableElement {
    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }
}

customElements.define("data-grid2-cells", DataGrid2Cells);