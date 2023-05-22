import { beforeAll, beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";
import {createMockChildren, ElementMock} from "../../mockups/element-mock.js";
import {EventMock} from "../../mockups/event-mock.js";

await init();

beforeAll(async () => {
    await import("../../test-data.js");
    await import("../../../src/managers/data-manager/data-manager-actions.js");
    await import("../../../components/page-toolbar/page-toolbar.js");
})

describe ("page-toolbar tests", async () => {
    let instance;
    let visualization;
    let eventPassedThrough;

    beforeEach(async () => {
        eventPassedThrough = false;

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

        await crs.call("data_manager", "register", {
            manager: "data_manager",
            id_field: "id",
            type: "memory",
            records: data
        });

        visualization = document.createElement("div");
        visualization.id = "vis";
        visualization.refresh = async () => {
            eventPassedThrough = true;
        }
        visualization.dataset["manager"] = "data_manager";

        document.body.appendChild(visualization);

        instance = document.createElement("page-toolbar");
        instance.setAttribute("for", "#vis");
        await instance.connectedCallback();
    })

    afterEach(async () => {
        visualization = null;
        instance.disconnectedCallback();
        instance = null;
    })

    // JHR: todo - toolbar needs to be updated.
    it.ignore("instance is not null", async () => {
        assert(instance !== null);
        assertEquals(instance.pageSize, 10);
        assertEquals(instance.lastPage, 10);
        assertEquals(instance.pageNumber, 1);
    });

    it ("click #gotoFirstPage", async () => {
        const button = new ElementMock("button");
        button.id = "gotoFirstPage";

        await instance.performEvent("click", button);

        assert(eventPassedThrough);
    })

    it ("click #gotoPreviousPage", async () => {
        const button = new ElementMock("button");
        button.id = "gotoPreviousPage";

        await instance.performEvent("click", button);

        assert(eventPassedThrough);
    })

    it ("click #gotoNextPage", async () => {
        const button = new ElementMock("button");
        button.id = "gotoNextPage";

        await instance.performEvent("click", button);

        assert(eventPassedThrough);
    })

    it ("click #gotoLastPage", async () => {
        const button = new ElementMock("button");
        button.id = "gotoLastPage";

        await instance.performEvent("click", button);

        assert(eventPassedThrough);
    })

    it ("change page size", async () => {
        const input = new ElementMock("input");
        input.id = "edtPageSize";
        input.min = 0;
        input.max = 100;
        input.dataset.property = "pageSize";

        document.body.appendChild(input);

        // 1. test for pages being set above 100
        input.value = 200;
        instance.performEvent("change", input);
        assertEquals(instance.pageSize, 100);

        // 2. test for pages being set below 1
        input.value = 0;
        instance.performEvent("change", input);
        assertEquals(instance.pageSize, 1);

        // 3. test for pages being set over the amount of available records
        input.value = 10;
        instance.performEvent("change", input);
        assertEquals(instance.pageSize, 10);

        // clean up the test resources
        document.body.removeChild(input);
    });
})