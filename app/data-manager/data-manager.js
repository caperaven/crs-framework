import "./../../packages/crs-process-api/action-systems/random-actions.js";
import "./../../src/managers/data-manager/data-manager-actions.js";

export default class DataManagerViewModel extends crsbinding.classes.ViewBase {
    #records;
    #manager = "test_data";

    async preLoad() {
        const data = await crs.call("random", "generate_collection", {
            definition: {
                id: "auto",
                code: "string:auto",
                description: "string:10",
                price: "float:1:100",
                quantity: "integer:1:100",
                isValid: "boolean"
            },
            count: 10000
        });

        await crs.call("data_manager", "register", {
            manager: this.#manager,
            id_field: "id",
            type: "idb",
            records: data
        })
    }
}