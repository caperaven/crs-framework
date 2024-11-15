import { beforeAll, beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";
import {createMockChildren} from "../../mockups/child-mock-factory.js";

await init();

beforeAll(async () => {
    await import("../../../components/toast-notification/toast-notification-actions.js");
})

describe ("toast-notification-actions", async () => {
    beforeEach(async () => {
        await globalThis.crs.call("toast_notification", "enable", { position: "bottom-center" });
    })

    afterEach(async () => {
        await globalThis.crs.call("toast_notification", "disable", { });
    });

    it ("enable", async () => {
        assert(document.body.querySelector("toast-notification") != null);
    })

    it ("disable", async () => {
        await globalThis.crs.call("toast_notification", "disable", { });
        assert(document.body.querySelector("toast-notification") == null);
    })

    // This test is giving us deno warnings about the timeout

    it ("show", async () => {
        const instance = document.body.querySelector("toast-notification");
        await instance.connectedCallback();
        createMockChildren(instance);

        // this duration is set to zero so that deno does not wait for the timeout
        // if deno waits for the timeout, the test will fail
        await globalThis.crs.call("toast_notification", "show", { message: "test", duration: 0 });
        assert(instance.shadowRoot.querySelector("toast-notification-item") != null);
    });
});