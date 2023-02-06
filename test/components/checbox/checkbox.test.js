import { beforeAll, beforeEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";
import {createMockChildren} from "../../mockups/child-mock-factory.js";
import {ElementMock} from "../../mockups/element-mock.js";
import {EventMock} from "../../mockups/event-mock.js";
import {afterEach} from "../../dependencies.js";

await init();


beforeAll(async () => {
    await import("../../../components/checkbox/checkbox.js");
});

describe ("checkbox", async () => {
    let instance;

    beforeEach(async () => {
        instance = document.createElement("check-box");
        instance.setAttribute("aria-label", "my-checkbox");
        await instance.connectedCallback();
        let loadFn = instance.load;
        instance.load = async () => {
            createMockChildren(instance);
            await loadFn();
        }
    });

    afterEach(async () => {
        await instance.disconnectedCallback();
    });

    it("check instance not null", async () => {
        assertEquals(instance != null, true);
        assertEquals(instance.getAttribute("aria-checked"), "false");
        assertEquals(instance.getAttribute("aria-label"), "my-checkbox");
        assertEquals(instance.shadowRoot.querySelector("#btnCheck").innerText, "check-box-blank");
    });
})



// describe("check-box", () => {
//     let checkbox;
//     let tristateCheckbox;
//
//     beforeEach(async () => {
//         checkbox = new checkboxModule.Checkbox();
//         checkbox.shadowRoot = new ElementMock("shadow-root");
//         checkbox.shadowRoot.queryResults["#btnCheck"] = new ElementMock("button", "#btnCheck");
//         checkbox.shadowRoot.queryResults["#lblText"] = new ElementMock("div", "#lblText");
//         checkbox.shadowRoot.querySelector("#btnCheck").innerText = "check-box";
//         checkbox.setAttribute("aria-label", "my-checkbox");
//         checkbox.setAttribute("aria-checked", "true");
//
//         tristateCheckbox = new checkboxModule.Checkbox();
//         tristateCheckbox.shadowRoot = new ElementMock("shadow-root");
//         tristateCheckbox.shadowRoot.queryResults["#btnCheck"] = new ElementMock("button", "#btnCheck");
//         tristateCheckbox.shadowRoot.queryResults["#lblText"] = new ElementMock("div", "#lblText");
//         tristateCheckbox.shadowRoot.querySelector("#btnCheck").innerText = "check-box-mixed";
//         tristateCheckbox.setAttribute("aria-label", "my-tristate-checkbox");
//         tristateCheckbox.setAttribute("aria-checked", "mixed");
//         tristateCheckbox.setAttribute("data-nullable", "true");
//     });
//
//     it("initial state for normal checkbox", () => {
//         assertEquals(checkbox.getAttribute("aria-checked"), "true");
//         assertEquals(checkbox.getAttribute("aria-label"), "my-checkbox");
//         assertEquals(checkbox.shadowRoot.querySelector("#btnCheck").innerText, "check-box");
//     });
//
//     it("change state for normal checkbox on click", async () => {
//         assertEquals(checkbox.getAttribute("aria-checked"), "true");
//         assertEquals(checkbox.getAttribute("aria-label"), "my-checkbox");
//         checkbox.load();
//         checkbox.shadowRoot.dispatchEvent("click");
//
//         assertEquals(checkbox.getAttribute("aria-checked"), "false");
//         assertEquals(checkbox.shadowRoot.querySelector("#btnCheck").innerText, "check-box-blank");
//     });
//
//     it("initial state for tristate checkbox", async () => {
//         assertEquals(tristateCheckbox.getAttribute("aria-checked"), "mixed");
//         assertEquals(tristateCheckbox.getAttribute("aria-label"), "my-tristate-checkbox");
//         assertEquals(tristateCheckbox.shadowRoot.querySelector("#btnCheck").innerText, "check-box-mixed");
//     });
//
//     it("change state for tristate checkbox on click", async () => {
//         assertEquals(tristateCheckbox.getAttribute("aria-checked"), "mixed");
//         assertEquals(tristateCheckbox.getAttribute("aria-label"), "my-tristate-checkbox");
//         tristateCheckbox.load();
//         tristateCheckbox.shadowRoot.dispatchEvent("click");
//
//         assertEquals(tristateCheckbox.getAttribute("aria-checked"), "true");
//         assertEquals(tristateCheckbox.shadowRoot.querySelector("#btnCheck").innerText, "check-box");
//
//         tristateCheckbox.shadowRoot.dispatchEvent("click");
//         assertEquals(tristateCheckbox.getAttribute("aria-checked"), "false");
//         assertEquals(tristateCheckbox.shadowRoot.querySelector("#btnCheck").innerText, "check-box-blank");
//     });
// });



