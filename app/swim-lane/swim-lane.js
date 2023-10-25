import "./../../components/kan-ban/swim-lane/swim-lane.js";
import "./../../src/managers/data-manager/data-manager-actions.js";
import "./../../components/kan-ban/cards-manager/cards-manager-actions.js";
import "./../../src/actions/virtualization-actions.js";

export default class Welcome extends crsbinding.classes.ViewBase {

    async preLoad() {
        const data  = generateData(1000);
        const staffHeaderTemplate = this.element.querySelector("#staff_header_template");
        const staffRecordTemplate = this.element.querySelector("#staff_record_template");

        await crs.call("cards_manager", "register", {
            name: "headerCard",
            template: staffHeaderTemplate,
            inflationFn: (element, record) => {
                element.querySelector("h2").textContent = record.title
            }
        });

        await crs.call("cards_manager", "register", {
            name: "recordCard",
            template: staffRecordTemplate,
            inflationFn: (element, record) => {
                element.querySelector(".code").textContent = record.code;
                element.querySelector(".value").textContent = record.value;
            }
        });

        await crs.call("data_manager", "register", {
            manager: "swimLaneDataManager",
            id_field: "id",
            type: "memory",
            records: data
        })
    }

    async load() {
        const swimLane = this.element.querySelector("swim-lane");
        await crs.call("component", "on_ready", {
            element: swimLane,
            caller: this,
            callback: () => swimLane.setHeader({ title: "John Doe" })
        });

        await super.load();
    }
}

function generateData(count) {
    const result = [];

    for (let i = 0; i < count; i++) {
        result.push({
            id: i,
            code: `code_${i}`,
            value: i
        })
    }

    return result;
}