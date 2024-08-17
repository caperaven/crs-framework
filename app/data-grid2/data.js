import "./../../packages/crs-process-api/action-systems/random-actions.js";
import "./../../src/managers/data-manager/data-manager-actions.js";

export async function generate_data(manager) {
    const definition = {};

    for (let i = 1; i < 31; i++) {
        definition[`field${i}`] = `string:10`;
    }

    const data = await crs.call("random", "generate_collection", {
        definition,
        count: 10000
    });

    await crs.call("data_manager", "register", {
        manager: manager,
        id_field: "id",
        type: "idb",
        records: data
    })
}

