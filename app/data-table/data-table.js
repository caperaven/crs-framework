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
                { id: 3, code: "code 3", description: "description 3" },
                { id: 4, code: "code 4", description: "description 4" },
                { id: 5, code: "code 5", description: "description 5" },
                { id: 6, code: "code 6", description: "description 6" },
                { id: 7, code: "code 7", description: "description 7" },
                { id: 8, code: "code 8", description: "description 8" },
                { id: 9, code: "code 9", description: "description 9" },
                { id: 10, code: "code 10", description: "description 10" }
            ]
        })
    }

    async addRecord() {
        // Todo: JHR
    }

    async updateRecord() {
        // Todo: JHR
    }

    async deleteRecord() {
        // Todo: JHR
    }
}