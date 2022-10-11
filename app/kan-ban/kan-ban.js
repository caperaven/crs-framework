import "/src/actions/columns-actions.js";
import "/src/data-manager.js";
import {records} from "./data.js";

export default class KanBan extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();

        await this.refresh();
    }

    preLoad() {
        crs.call("data_manager", "register", {
            manager: "kanban_data",
            id_field: "id",
            type: "memory"
        })
    }

    load() {
        const template = this._element.querySelector("#tplSimple");
        crsbinding.inflationManager.register("simple", template);

        super.load();
    }

    async addColumn() {
        await crs.call("grid_columns", "add_columns", {
            element: this.kanban,
            columns: [
                { id: 1001, width: 200, title: "Awaiting Approval", field: "status", statusId: 0, status: "awaiting approval" },
                { id: 1002, width: 200, title: "In Progress", field: "status", statusId: 1, status: "in progress" },
                { id: 1003, width: 200, title: "Closed", field: "status", statusId: 2, status: "closed" }
            ]
        })
    }

    async refresh() {
        await crs.call("data_manager", "set_records", {
            manager: "kanban_data",
            records: records
        })
    }

    async add() {
        await crs.call("data_manager", "append", {
            manager: "kanban_data",
            records: [
                { id: 1005, code: "Code F", status:"awaiting approval" }
            ]
        })
    }

    async remove() {

    }

    async update() {

    }
}