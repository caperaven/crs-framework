import "./../../components/kan-ban/kanban-component/kanban-component.js";
import "./../../src/managers/data-manager/data-manager-actions.js";

export default class KanBan extends crsbinding.classes.ViewBase {
    async preLoad() {
        const data = [];

        for (let i = 0; i < 100; i++) {
            data.push({
                title: `User ${i}`,
                records: generateRecords(1000, i * 100, i * 100)
            })
        }

        await crs.call("data_manager", "register", { manager: "kanbanDataManager", records: data });
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