import "./../../components/kan-ban/swim-lane/swim-lane.js";
import "./../../src/managers/data-manager/data-manager-actions.js";
import "./../../components/kan-ban/cards-manager/cards-manager-actions.js";
import "./../../src/actions/virtualization-actions.js";

export default class Welcome extends crsbinding.classes.ViewBase {

    async preLoad() {
        this.setProperty("recordCount", 1000);
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
            type: "memory"
        })
    }

    async load() {
        const swimLane = this.element.querySelector("swim-lane");
        await crs.call("component", "on_ready", {
            element: swimLane,
            caller: this,
            callback: async () => {
                const data  = generateData(1000);

                await swimLane.setHeader({ title: "John Doe" });

            }
        });

        await super.load();
    }

    async refresh() {
        const recordCount = this.getProperty("recordCount");

        await crs.call("data_manager", "set_records", {
            manager: "swimLaneDataManager",
            records: generateData(recordCount)
        })
    }

    async update() {
        await crs.call("data_manager", "update", {
            manager: "swimLaneDataManager",
            id: 0,
            changes: { code: "Updated Code", value: 1024 }
        });
    }

    /**
     * Todo: JHR / Gerhard, support batch updates
     * @returns {Promise<void>}
     */
    async batchUpdate() {
        await crs.call("data_manager", "batch_update", {
            manager: "swimLaneDataManager",
            updates: [
                { id: 0, changes: { code: "Updated Code 0", value: 1020 } },
                { id: 1, changes: { code: "Updated Code 1", value: 1021 } },
                { id: 2, changes: { code: "Updated Code 2", value: 1022 } },
                { id: 3, changes: { code: "Updated Code 3", value: 1023 } },
                { id: 4, changes: { code: "Updated Code 4", value: 1024 } }
            ]
        });
    }

    async insert() {
        await crs.call("data_manager", "append", {
            manager: "swimLaneDataManager",
            records: [
                { id: 2000, code: "bingo_0", value: 2000 },
                { id: 2001, code: "bingo_1", value: 2010 },
                { id: 2002, code: "bingo_2", value: 2020 },
                { id: 2003, code: "bingo_3", value: 2030 },
                { id: 2004, code: "bingo_4", value: 2040 },
            ]
        });
    }

    async delete() {
        await crs.call("data_manager", "remove", {
            manager: "swimLaneDataManager",
            indexes: 0
        });
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