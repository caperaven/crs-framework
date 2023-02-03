import { beforeAll, beforeEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";
import {createMockChildren} from "../../mockups/child-mock-factory.js";
import {ElementMock} from "../../mockups/element-mock.js";
import {EventMock} from "../../mockups/event-mock.js";

let checkboxModule;

beforeAll(async () => {
    await init();
    checkboxModule = await import("../../../components/checkbox/checkbox.js");
});

describe("check-box", () => {
    let checkbox;

    beforeEach(async () => {
        checkbox = new checkboxModule.Checkbox();
        checkbox.shadowRoot = new ElementMock("shadow-root");
        checkbox.shadowRoot.queryResults["#btnCheck"] = new ElementMock("button", "#btnCheck");
        checkbox.shadowRoot.queryResults["#lblText"] = new ElementMock("div", "#lblText");
        checkbox.setAttribute("aria-label", "my-checkbox");
        checkbox.setAttribute("aria-checked", "true");
    });

    it("initial state for normal checkbox", () => {
        assertEquals(checkbox.getAttribute("aria-checked"), "true");
    });

    it("change state for normal checkbox on click", async () => {
        assertEquals(checkbox.getAttribute("aria-checked"), "true");
        checkbox.load();
        checkbox.shadowRoot.dispatchEvent("click");

        assertEquals(checkbox.getAttribute("aria-checked"), "false");
    });
});



