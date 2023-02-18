import "./../../components/data-table/data-table.js";
import "./../../src/data-manager/data-manager-actions.js";
export default class DataTableViewModel extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();

        const dataTable = this._element.querySelector("data-table");

        await crs.call("component", "on_ready", {
            element: dataTable,
            callback: () => {
                dataTable.refresh();
            },
            caller: this
        });
    }

    async preLoad() {
        await crs.call("data_manager", "register", {
            manager: "my_data",
            id_field: "id",
            type: "memory",
            records: [
                { id: 1, code: "code 1", description: "description 1" },
                { id: 2, code: "code 2", description: "description 2" },
                { id: 3, code: "code 3", description: "description 3" }
            ]
        })
    }
}