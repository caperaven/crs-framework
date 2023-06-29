import "/src/actions/columns-actions.js";
import "/src/data-manager/data-manager-memory-provider.js";
import {records} from "./data.js";
import {schema} from "./schema.js";
import AvailableSelectedViewModel from "../available-selected/available-selected.js";

export default class KanBanViewModel extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }
    async connectedCallback() {
        await super.connectedCallback();

        crs.processSchemaRegistry.add(schema);

        await this.refresh();
    }

    async disconnectedCallback() {
        await crs.binding.inflation.manager.unregister("simple");
        await crs.call("data_manager", "dispose", {
            manager: "kanban_data"
        })
    }

    preLoad() {
        crs.call("data_manager", "register", {
            manager: "kanban_data",
            id_field: "id",
            type: "memory"
        })
    }

    load() {
        const template = this.shadowRoot.querySelector("#tplSimple");
        crs.binding.inflation.manager.register("simple", template);

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
                { id: 1005, code: "Code F", statusId: 0, status:"awaiting approval" }
            ]
        })
    }

    async remove() {
        await crs.call("data_manager", "remove", {
            manager: "kanban_data",
            ids: [1005, 1001]
        })
    }

    async update() {
        await crs.call("data_manager", "update", {
            manager: "kanban_data",
            id: 1002,
            changes: {
                code: "Hello World"
            }
        })
    }
}