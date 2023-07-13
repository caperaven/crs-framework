import "./../../test/test-data.js";
import "./../../src/managers/data-manager/data-manager-actions.js";

const DB_MANAGER = "data_manager_idb";

export default class DataManagerIdb extends crs.classes.BindableElement {
    #store;

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    get shadowDom() {
        return true;
    }

    get hasStyle() {
        return false;
    }

    async preLoad() {
        this.setProperty("hasRecords", false);
        this.setProperty("recordIndex", 0);
    }

    async generateData(type) {
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

        const start = performance.now();

        this.#store = await crs.call("data_manager", "register", {
            manager: DB_MANAGER,
            id_field: "id",
            type: type,
            records: data
        })

        const end = performance.now();
        const total = `${end - start} ms`;

        this.setProperty("recordCount", data.length);
        this.setProperty("hasRecords", true);
        this.setProperty("writeTime", total);

        await this.refreshRecord();
    }

    async previousRecord() {
        await this.updateProperty("recordIndex", (value) => value == 0 ? 0 : value - 1);
        await this.refreshRecord();
    }

    async nextRecord() {
        await this.updateProperty("recordIndex", (value) => value + 1);
        await this.refreshRecord();
    }

    async refreshRecord() {
        const result = await crs.call("data_manager", "get", {
            manager: DB_MANAGER,
            index: this.getProperty("recordIndex")
        })

        this.setProperty("model", result[0]);
    }

    async saveRecord() {
        const model = this.getProperty("model");
        await crs.call("data_manager", "update", {
            manager: DB_MANAGER,
            models: [model]
        });
    }

    async deleteRecord() {
        await crs.call("data_manager", "remove", {
            manager: DB_MANAGER,
            indexes: [this.getProperty("recordIndex")]
        });
    }

    async setSelected() {
        await crs.call("data_manager", "set_selected", {
            manager: DB_MANAGER,
            indexes: [0, 2, 4, 6],
            selected: true
        });

        await this.getSelected();
    }

    async toggleSelected() {
        await crs.call("data_manager", "toggle_selection", {
            manager: DB_MANAGER
        })

        await this.getSelected();
    }

    async selectAll() {
        await crs.call("data_manager", "set_select_all", {
            manager: DB_MANAGER
        })

        await this.getSelected();
    }

    async selectNone() {
        await crs.call("data_manager", "set_select_all", {
            manager: DB_MANAGER,
            selected: false
        })

        await this.getSelected();
    }

    async getSelected() {
        let result = await crs.call("data_manager", "get_selected", {
            manager: DB_MANAGER
        })

        this.setProperty("selected", result);

        result = await crs.call("data_manager", "get_unselected", {
            manager: DB_MANAGER
        })

        this.setProperty("unselected", result);

        // await crs.binding.data.updateUI(this, "selected");
        // await crs.binding.data.updateUI(this, "unselected");
    }

}