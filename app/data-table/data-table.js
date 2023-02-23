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
                { id: 10, code: "code 10", description: "description 10" },
                { id: 11, code: "code 11", description: "description 11" },
                { id: 12, code: "code 12", description: "description 12" },
                { id: 13, code: "code 13", description: "description 13" },
                { id: 14, code: "code 14", description: "description 14" },
                { id: 15, code: "code 15", description: "description 15" },
                { id: 16, code: "code 16", description: "description 16" },
                { id: 17, code: "code 17", description: "description 17" },
                { id: 18, code: "code 18", description: "description 18" },
                { id: 19, code: "code 19", description: "description 19" },
                { id: 20, code: "code 20", description: "description 20" },
                { id: 21, code: "code 21", description: "description 21" },
                { id: 22, code: "code 22", description: "description 22" },
                { id: 23, code: "code 23", description: "description 23" },
                { id: 24, code: "code 24", description: "description 24" },
                { id: 25, code: "code 25", description: "description 25" }
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