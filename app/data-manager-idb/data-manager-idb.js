import "./../../test/test-data.js";
import "./../../src/managers/data-manager/data-manager-actions.js";

const DB_MANAGER = "data_manager_idb";

export default class DataManagerIdb extends crsbinding.classes.ViewBase {

    async generateData() {
        const data = await crs.call("test_data", "get", {
            fields: {
                code: "string:auto",
                description: "string:10",
                price: "float:1:100",
                quantity: "int:1:100",
                isValid: "bool"
            },
            count: 10000
        });

        await crs.call("data_manager", "register", {
            manager: DB_MANAGER,
            id_field: "id",
            type: "idb",
            records: data
        })

        this.setProperty("recordCount", data.length);
    }

}