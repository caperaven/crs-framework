import {assertEquals, beforeAll, beforeEach, describe, it} from "./../../dependencies.js";
import {init} from "../../mockups/init.js";
import {EventMock} from "../../mockups/event-mock.js";

describe("Dialog", () => {
    let instance;

    beforeAll(async () => {
        await init();
        await import("./../../../components/dialog/dialog-actions.js");
    });

    beforeEach(async () => {
        instance = document.createElement("dialog-component");
        await instance.connectedCallback();
    });

    it("should initialize the instance", () => {
        assertEquals(instance != null, true);
    });

    it("should show a dialog with a custom text title and text content", async () => {
        await instance.show(null, "my content", null, {title: "My Title"});
        await timeOutAssert(instance.shadowRoot, "#headerText", "My Title", 400);
    });

    it("should be able to show elements in the body", async () => {
        const bodyDiv = document.createElement("div");
        bodyDiv.textContent = "my content";
        await instance.show(null, bodyDiv, null, null);
        await timeOutAssert(instance, '[slot="body"]', "my content", 400);
    });

    it("should be able to show elements in the header", async () => {
        const headerDiv = document.createElement("div");
        headerDiv.textContent = "my header";
        await instance.show(headerDiv, null, null, null);
        await timeOutAssert(instance.shadowRoot, "header", "my header", 400);
    });

    it("should be able to accept strings for the close button and resize button", async () => {
        await instance.show(null, null, null, {closeText: "Close", resizeText: "Resize"});
        await new Promise((resolve) => {
            setTimeout(() => {
                assertEquals(instance.shadowRoot.querySelector("#btnClose").getAttribute("aria-label"), "Close");
                assertEquals(instance.shadowRoot.querySelector("#btnResize").getAttribute("aria-label"), "Resize");
                resolve();
            },400);
        });
    });
    // I want to be able to write tests like this the test framework is too restrictive
    // Connected callback should automatically be called.
    // it("should be able to close on clicking outside the dialog", async () => {
    //     const dialog = await crs.call("dialog", "show", {content: "my content", title: "My Title", auto_close: true});
    //     await dialog.connectedCallback();
    //     const backLayer = dialog.shadowRoot.querySelector("#back-layer");
    //     dialog.shadowRoot.dispatchEvent(new EventMock("click"), {target: backLayer});
    //     assertEquals(globalThis.dialog == null, true);
    // });
});

function timeOutAssert(instance, selector, value, timeout) {
    return new Promise((resolve) => {
        setTimeout(() => {
            assertEquals(instance.querySelector(selector).textContent, value);
            resolve();
        }, timeout);
    });
}