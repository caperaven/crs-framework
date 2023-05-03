import { beforeAll, beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";
import {createMockChildren, ElementMock} from "../../mockups/element-mock.js";
import {EventMock} from "../../mockups/event-mock.js";

await init();

beforeAll(async () => {
    await import("../../../components/busy-ui/busy-ui.js");
    await import("../../../components/busy-ui/busy-ui-actions.js");
})

describe ("busy-ui tests", async () => {
    let instance;
    let progress = "Loading... loaded 0 out of 100";
    let message = "Loading...";

    beforeEach(async () => {
        instance = document.createElement("busy-ui");
        instance.dataset.message = message;
        instance.dataset.progress = progress;
        await instance.connectedCallback();
    })

    it("instance is not null", async () => {
        assert(instance !== null);
    });


    it("instance show state" , async () => {
        let myElement = new ElementMock("div", "myElement");


         await crs.call("busy_ui", "show", {
            "element": myElement,
            "message": message,
            "progress": progress
        });

        await instance.progressUpdater();

    })


})