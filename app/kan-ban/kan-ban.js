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