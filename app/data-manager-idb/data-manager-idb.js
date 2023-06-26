import "./../../test/test-data.js";
import "./../../src/managers/data-manager/data-manager-actions.js";

const DB_MANAGER = "data_manager_idb";

export default class DataManagerIdb extends crs.classes.BindableElement {
    #store;

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get hasStyle() {
        return false;
    }

    async preLoad() {
        this.setProperty("hasRecords", false);
        this.setProperty("recordIndex", 0);
    }

    async generateData() {
        const data = await crs.call("test_data", "get", {
            fields: {
                code: "string:auto",
                description: "string:10",
                price: "float:1:100",
                quantity: "int:1:100",
                isValid: "bool"
            },
            count: 1000
        });

        const start = performance.now();

        this.#store = await crs.call("data_manager", "register", {
            manager: DB_MANAGER,
            id_field: "id",
            type: "idb",
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

        this.setProperty("model", result.data[0]);
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

}