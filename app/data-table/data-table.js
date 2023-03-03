import "./../../components/data-table/data-table.js";
import "./../../components/page-toolbar/page-toolbar.js";
import "./../../src/data-manager/data-manager-actions.js";
import "./../../test/test-data.js";

export default class DataTableViewModel extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();

        // const dataTable = this._element.querySelector("data-table");
        //
        // await crs.call("component", "on_ready", {
        //     element: dataTable,
        //     callback: () => {
        //         dataTable.refresh();
        //     },
        //     caller: this
        // });
    }

    async preLoad() {
        const data = await crs.call("test_data", "get", {
            fields: {
                code: "string:auto",
                description: "string:10",
                price: "float:1:100",
                quantity: "int:1:100",
                isValid: "bool"
            },
            count: 100
        });

        await crs.call("data_manager", "register", {
            manager: "my_data",
            id_field: "id",
            type: "memory",
            records: data
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