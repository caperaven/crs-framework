import { beforeAll, beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";
import {createMockChildren, ElementMock} from "../../mockups/element-mock.js";
import {EventMock} from "../../mockups/event-mock.js";
import {createChildrenFromHtml} from "../../mockups/child-mock-factory.js";

await init();

beforeAll(async () => {
    await import("../../../src/data-manager/data-manager-actions.js");
    await import("../../../components/data-table/data-table.js");
})

describe ("data-table tests", async () => {
    let instance;

    beforeEach(async () => {
        await crs.call("data_manager", "register", {
            manager: "data_manager",
            id_field: "id",
            type: "memory",
            records: [
                { id: 1, code: "row 1 code", description: "row 1 description" },
                { id: 2, code: "row 2 code", description: "row 2 description" },
                { id: 3, code: "row 3 code", description: "row 3 description" }
            ]
        });

        instance = document.createElement("data-table");
        instance.dataset["manager"] = "data_manager";
        instance.dataset["manager-key"] = "data_manager_key";

        createChildrenFromHtml(instance, [
            `<column data-heading="code" data-property="code" data-width="100"></column>`,
            `<column data-heading="description" data-property="description" data-width="200"></column>`
        ].join(" "), false);

        await instance.connectedCallback();
    })

    afterEach(async () => {
        instance.disconnectedCallback();
        instance = null;
    })

    it("instance is not null", async () => {
        assert(instance !== null);
    });
})