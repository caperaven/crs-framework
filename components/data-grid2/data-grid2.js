import "./data-grid2-cells/data-grid2-cells.js";

export default class DataGrid2 extends crs.classes.BindableElement {
    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    #notifyColumnsChanged() {
        this.querySelector("data-grid2-cells")?.onMessage({columns: this.columns});
    }
}

customElements.define("data-grid2", DataGrid2);