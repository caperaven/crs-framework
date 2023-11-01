import "./../../components/kan-ban/kanban-component/kanban-component.js";

export default class KanBan extends crsbinding.classes.ViewBase {
    #data;

    async preLoad() {
        this.#data = [];

        for (let i = 0; i < 100; i++) {
            this.#data.push({
                header: {
                    title: `User ${i}`,
                },
                records: generateRecords(1000, i * 100, i * 100)
            })
        }
    }

    async load() {
        const kanban = this.element.querySelector("kanban-component");
        await crs.call("component", "on_loading", {
            element: kanban,
            callback: async () => {
                await crs.call("data_manager", "register", { manager: "kanbanDataManager", records: this.#data });
                await kanban.initialize();
            }
        });
        super.load();
    }

    async refresh() {
        await crs.call("data_manager", "refresh", { manager: "kanbanDataManager" });
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