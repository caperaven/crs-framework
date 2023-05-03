import { beforeAll, beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";
import {createMockChildren, ElementMock} from "../../mockups/element-mock.js";
import {EventMock} from "../../mockups/event-mock.js";
import {cloneElementMock} from "../../mockups/clone-node.js";

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

        let loader = myElement.querySelector("busy-ui");

        assert(myElement.querySelector("busy-ui").dataset.message === message);
        assert(myElement.querySelector("busy-ui").dataset.progress === progress);
        assert(myElement.style.position === "relative");
    })

    it("instance update state" , async () => {
        let myElement = new ElementMock("div", "myElement");

        await crs.call("busy_ui", "show", {
            "element": myElement,
            "message": message,
            "progress": progress
        });


        await crs.call("busy_ui", "update", {
            "element": myElement,
            "message": "Loading... updated",
            "progress": "loaded 50 out of 100"
        })

        assert(myElement.querySelector("busy-ui").dataset.message === "Loading... updated");
        assert(myElement.querySelector("busy-ui").dataset.progress === "loaded 50 out of 100");
        assert(myElement.style.position === "relative");
    });

    it("instance hide state" , async () => {
        let myElement = new ElementMock("div", "myElement");

        await crs.call("busy_ui", "show", {
            "element": myElement,
            "message": message,
            "progress": progress
        });

        let loader = myElement.querySelector("busy-ui");

        assert(myElement.querySelector("busy-ui").dataset.message === message);
        assert(myElement.querySelector("busy-ui").dataset.progress === progress);

        await crs.call("busy_ui", "hide", {
            "element": myElement
        })

        assert(myElement.querySelector("busy-ui") === null);
    })

    it("instance test" , async () => {
        let myElement = new ElementMock("div", "myElement");

        await crs.call("busy_ui", "show", {
            "element": myElement,
            "message": message,
            "progress": progress
        });

        let loader = myElement.querySelector("busy-ui");
        loader.connectedCallback();

        assert(loader.dataset.message === message);
        assert(loader.dataset.progress === progress);
        assert(myElement.style.position === "relative");
    });

    it("instance append test" , async () => {
        let myElement = new ElementMock("div", "myElement");
        myElement.appendChild(instance);
        myElement.id = "my-element";
        instance.id = "my-instance";

        await crs.call("busy_ui", "show", {
            "element": myElement,
            "message": message,
            "progress": progress
        });

        assert(instance.shadowRoot.querySelector("#lblMessage").innerText === message);
        assert(instance.dataset.message === message);
        assert(instance.dataset.progress === progress);
        assert(myElement.style.position === "relative");


        await crs.call("busy_ui", "update", {
            "element": myElement,
            "message": "TESTING",
            "progress": "More testing"
        });

        assert(instance.dataset.message === "TESTING");
        assert(instance.dataset.progress === "More testing");
        assert(myElement.style.position === "relative");


        await crs.call("busy_ui", "hide", {
            "element": myElement,
        });

        assert(myElement.querySelector("busy-ui") === null);
    });

})