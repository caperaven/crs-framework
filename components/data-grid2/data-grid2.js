import "./data-grid2-cells/data-grid2-cells.js";
import {assertClassType} from "../../src/utils/assertClassType.js";

export default class DataGrid2 extends crs.classes.BindableElement {
    #columns;

    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get columns() {
        return Object.freeze(this.#columns);
    }

    set columns(newValue) {
        this.#columns = assertClassType(newValue, "Columns");
    }

    #notifyColumnsChanged() {
        this.querySelector("data-grid2-cells")?.onMessage({columns: this.columns});
    }
}

customElements.define("data-grid2", DataGrid2);