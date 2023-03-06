import { beforeAll, beforeEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";
import {createMockChildren} from "../../mockups/child-mock-factory.js";
import {ElementMock} from "../../mockups/element-mock.js";
import {EventMock} from "../../mockups/event-mock.js";
import {afterEach} from "../../dependencies.js";

await init();
let instance;

async function createInstance(nullable = false, controls = []) {
    instance = document.createElement("check-box");

    if(nullable === true) {
        instance.dataset.nullable = "true";
    }
    if(controls.length > 0) {
        instance.setAttribute("aria-controls", controls.join(" "));
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

describe ("checkbox with aria-controls", async () => {
    async function createCheckbox(id) {
        const checkbox = document.createElement("check-box");

        checkbox.setAttribute("aria-label", "my-checkbox");
        checkbox.setAttribute("id", id);
        await checkbox.connectedCallback();
        return checkbox;
    }

    afterEach(async () => {
        await instance.disconnectedCallback();
    });

    it("check instance not null", async () => {
        await createInstance(true, ["check-box-1", "check-box-2"]);
        assertEquals(instance != null, true);
        assertEquals(instance.getAttribute("aria-checked"), "false");
        assertEquals(instance.getAttribute("aria-label"), "my-checkbox");
        assertEquals(instance.getAttribute("aria-controls"), "check-box-1 check-box-2");
        assertEquals(instance.shadowRoot.querySelector("#btnCheck").innerText, "check-box-blank");
    });

    it("'parent' checkbox click", async () => {
        //Arrange
        const checkbox1 = await createCheckbox("check-box-1");
        const checkbox2 = await createCheckbox("check-box-2");
        await createInstance(false, ["check-box-1", "check-box-2"]);

        globalThis.document.appendChild(instance);
        globalThis.document.appendChild(checkbox1);
        globalThis.document.appendChild(checkbox2);

        //Act
        instance.shadowRoot.dispatchEvent(new EventMock("click"));

        //Assert
        assertEquals(instance.getAttribute("aria-checked"), "true");
        assertEquals(checkbox1.getAttribute("aria-checked"), "true");
        assertEquals(checkbox2.getAttribute("aria-checked"), "true");
        assertEquals(instance.shadowRoot.querySelector("#btnCheck").innerText, "check-box");

        //Act
        instance.shadowRoot.dispatchEvent(new EventMock("click"));

        //Assert
        assertEquals(instance.getAttribute("aria-checked"), "false");
        assertEquals(checkbox1.getAttribute("aria-checked"), "false");
        assertEquals(checkbox2.getAttribute("aria-checked"), "false");
        assertEquals(instance.shadowRoot.querySelector("#btnCheck").innerText, "check-box");
    });

    it("'child' checkbox click", async () => {
        //Arrange
        const checkbox1 = await createCheckbox("check-box-1");
        const checkbox2 = await createCheckbox("check-box-2");
        await createInstance(false, ["check-box-1", "check-box-2"]);

        globalThis.document.appendChild(instance);
        globalThis.document.appendChild(checkbox1);
        globalThis.document.appendChild(checkbox2);

        //Act
        //Clicking first checkbox
        checkbox1.shadowRoot.dispatchEvent(new EventMock("click"));

        //Assert
        assertEquals(instance.getAttribute("aria-checked"), null);
        assertEquals(checkbox1.getAttribute("aria-checked"), "true");
        assertEquals(checkbox2.getAttribute("aria-checked"), "false");
        assertEquals(instance.shadowRoot.querySelector("#btnCheck").innerText, "check-box-mixed");

        //Act
        //Clicking second checkbox
        checkbox2.shadowRoot.dispatchEvent(new EventMock("click"));

        //Assert
        assertEquals(instance.getAttribute("aria-checked"), "true");
        assertEquals(checkbox1.getAttribute("aria-checked"), "true");
        assertEquals(checkbox2.getAttribute("aria-checked"), "true");
        assertEquals(instance.shadowRoot.querySelector("#btnCheck").innerText, "check-box");

        //Act
        //Clicking first checkbox
        checkbox1.shadowRoot.dispatchEvent(new EventMock("click"));

        //Assert
        assertEquals(instance.getAttribute("aria-checked"), null);
        assertEquals(checkbox1.getAttribute("aria-checked"), "false");
        assertEquals(checkbox2.getAttribute("aria-checked"), "true");
        assertEquals(instance.shadowRoot.querySelector("#btnCheck").innerText, "check-box-mixed");

        //Act
        //Clicking second checkbox
        checkbox2.shadowRoot.dispatchEvent(new EventMock("click"));

        //Assert
        assertEquals(instance.getAttribute("aria-checked"), "false");
        assertEquals(checkbox1.getAttribute("aria-checked"), "false");
        assertEquals(checkbox2.getAttribute("aria-checked"), "false");
        assertEquals(instance.shadowRoot.querySelector("#btnCheck").innerText, "check-box-blank");
    });
})