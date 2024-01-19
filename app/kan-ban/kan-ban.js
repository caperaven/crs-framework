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

import "./../../components/kan-ban/kanban-component/kanban-component.js";
import "./../../src/actions/virtualization-actions.js";
import "./../../packages/crs-process-api/action-systems/component-actions.js";

export default class KanBan extends crsbinding.classes.ViewBase {
    async load() {
        const kanban = this.element.querySelector("kanban-component");
        await crs.call("component", "on_loading", {
            element: kanban,
            callback: async () => {
                await crs.call("data_manager", "register", { manager: "kanbanDataManager", type: "memory" });
                await kanban.initialize();
            }
        });
        super.load();
    }

    async refresh(quantity) {
        const data = [];

        for (let i = 0; i < Number(quantity); i++) {
            data.push({
                header: {
                    title: `User ${i}`,
                },
                records: generateRecords(100, i * 100, i * 100)
            })
        }

        await crs.call("data_manager", "set_records", { manager: "kanbanDataManager", records: data });
    }
}

function generateRecords(count, start, startValue) {
    const result = [];

    for (let i = 0; i < count; i++) {
        result.push({
            "code": `Record ${start + i}`,
            "value": startValue + i
        });
    }

    return result;
}