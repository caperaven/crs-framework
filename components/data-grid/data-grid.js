import "./grid-cells/grid-cells.js";
import {assertClassType} from "../../src/utils/assertClassType.js";

const DATA_GRID_CELLS_QUERY = "data-grid-cells";

export default class DataGrid extends crs.classes.BindableElement {
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
        this.querySelector(DATA_GRID_CELLS_QUERY)?.onMessage({columns: this.columns});
    }
}

customElements.define("data-grid", DataGrid);