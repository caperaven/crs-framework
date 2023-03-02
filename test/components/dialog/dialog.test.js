import {assertEquals, beforeAll, beforeEach, describe, it} from "./../../dependencies.js";
import {init} from "../../mockups/init.js";
import {EventMock} from "../../mockups/event-mock.js";

describe("Dialog", () => {
    let instance;

    beforeAll(async () => {
       await init();
       await import("./../../../components/dialog/dialog.js");
    });

    beforeEach(async () => {
        instance = document.createElement("dialog-component");
        await instance.connectedCallback();
    });

    // it("should initialize the instance", () => {
    //     assertEquals(instance != null, true);
    // });
    //
    // it("should show a dialog with a custom text title and text content", async () => {
    //     await instance.show(null, "my content", null, {title: "My Title"});
    //     assertEquals(instance.shadowRoot.querySelector("#headerText").textContent, "My Title");
    // });
    //
    // it("should be able to show elements in the body", async () => {
    //     const bodyDiv = document.createElement("div");
    //     bodyDiv.textContent = "my content";
    //     await instance.show(null, bodyDiv, null, null);
    //     assertEquals(instance.shadowRoot.querySelector("#body").textContent, "my content");
    // });
    //
    // it("should be able to show elements in the header", async () => {
    //     const headerDiv = document.createElement("div");
    //     headerDiv.textContent = "my header";
    //     await instance.show(headerDiv, null, null, null);
    //     assertEquals(instance.shadowRoot.querySelector("header").textContent, "my header");
    // });
    //
    // it("should be able to accept strings for the close button and resize button", async () => {
    //     await instance.show(null, null, null, {closeText: "Close", resizeText: "Resize"});
    //     assertEquals(instance.shadowRoot.querySelector("#btnClose").getAttribute("aria-label"), "Close");
    //     assertEquals(instance.shadowRoot.querySelector("#btnResize").getAttribute("aria-label"), "Resize");
    // });

    it("should be able to close on clicking outside the dialog", async () => {
        await instance.show(null, null, null, {autoClose: true});
        const backLayer = instance.shadowRoot.querySelector("[id=back-layer]");
        instance.shadowRoot.dispatchEvent(new EventMock("click"), {target: backLayer});
    });
});