import "../../components/data-grid/data-grid-actions.js";
import {generate_data} from "./data.js";

const DATA_MANAGER = "test_data";

export default class DataGrid2ViewModel extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async load() {
        const grid = this.shadowRoot.querySelector("data-grid");
        await crs.call("datagrid2", "initialize", { element: grid, manager: DATA_MANAGER });
        await generate_data(DATA_MANAGER);
    }
}