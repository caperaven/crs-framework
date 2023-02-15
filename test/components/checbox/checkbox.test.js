import { beforeAll, beforeEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";
import {createMockChildren} from "../../mockups/child-mock-factory.js";
import {ElementMock} from "../../mockups/element-mock.js";
import {EventMock} from "../../mockups/event-mock.js";
import {afterEach} from "../../dependencies.js";

await init();
let instance;

async function createInstance(nullable = false) {
    instance = document.createElement("check-box");

    if(nullable === true) {
        instance.dataset.nullable = "true";
    }

    instance.setAttribute("aria-label", "my-checkbox");
    await instance.connectedCallback();
}

beforeAll(async () => {
    await import("../../../components/checkbox/checkbox.js");
});

describe ("checkbox", async () => {

    afterEach(async () => {
        await instance.disconnectedCallback();
    });

    it("check instance not null", async () => {
        await createInstance();
        assertEquals(instance != null, true);
        assertEquals(instance.getAttribute("aria-checked"), "false");
        assertEquals(instance.getAttribute("aria-label"), "my-checkbox");
        assertEquals(instance.shadowRoot.querySelector("#btnCheck").innerText, "check-box-blank");
    });

    it("normal state click", async () => {
        await createInstance();
        instance.shadowRoot.dispatchEvent(new EventMock("click"));
        assertEquals(instance.getAttribute("aria-checked"), "true");
        assertEquals(instance.shadowRoot.querySelector("#btnCheck").innerText, "check-box");

        instance.shadowRoot.dispatchEvent(new EventMock("click"));
        assertEquals(instance.getAttribute("aria-checked"), "false");
        assertEquals(instance.shadowRoot.querySelector("#btnCheck").innerText, "check-box-blank");
    });

    it("tristate state click", async () => {
        await createInstance(true);
        assertEquals(instance.getAttribute("aria-checked"), "mixed");
        assertEquals(instance.shadowRoot.querySelector("#btnCheck").innerText, "check-box-mixed");

        instance.shadowRoot.dispatchEvent(new EventMock("click"));
        assertEquals(instance.getAttribute("aria-checked"), "true");
        assertEquals(instance.shadowRoot.querySelector("#btnCheck").innerText, "check-box");

        instance.shadowRoot.dispatchEvent(new EventMock("click"));
        assertEquals(instance.getAttribute("aria-checked"), "false");
        assertEquals(instance.shadowRoot.querySelector("#btnCheck").innerText, "check-box-blank");
    });
})




