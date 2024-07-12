export default class DataGrid2Cells extends crs.classes.BindableElement {
    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    onMessage(args) {
        console.log(args)
    }
}

customElements.define("data-grid2-cells", DataGrid2Cells);