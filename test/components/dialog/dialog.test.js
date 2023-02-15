import {assertEquals, beforeAll, beforeEach, describe, it} from "./../../dependencies.js";
import {createMockChildren} from "../../mockups/child-mock-factory.js";
import {init} from "../../mockups/init.js";

describe("Dialog", () => {
    let instance;

    beforeAll(async () => {
       await init();
       await import("./../../../components/dialog/dialog.js");
    });

    beforeEach(async () => {
        instance = document.createElement("dialog-component");
        await instance.connectedCallback();
        createMockChildren(instance);
    });

    it("should initialize the instance", () => {
        assertEquals(instance != null, true);
    });

    it("should show a dialog with a custom text title and text content", async () => {
        await instance.show(null, "my content", null, {title: "My Title"});
        assertEquals(instance.shadowRoot.querySelector("#headerText").textContent, "My Title");
    });

    it("should be able to hide header buttons", async () => {
        await instance.show(null, null, null, {title: "My Title", showHeaderButtons: false});
        const buttons = instance.shadowRoot.querySelectorAll("button");
        assertEquals(buttons.map(b => b.style.display), ["none", "none"]);
    });

    it("should be able to show elements in the body", async () => {
        const bodyDiv = document.createElement("div");
        bodyDiv.textContent = "my content";
        await instance.show(null, bodyDiv, null, null);
        assertEquals(instance.shadowRoot.querySelector("#body").textContent, "my content");
    });
});