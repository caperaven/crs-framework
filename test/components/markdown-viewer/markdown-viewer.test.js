import { beforeAll, beforeEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";
import {createMockChildren} from "../../mockups/child-mock-factory.js";

await init();

beforeAll(async () => {
    await import("../../../components/markdown-viewer/markdown-viewer-actions.js");
})

describe ("markdown-viewer", async () => {
    let instance;
    beforeEach(async () => {
        instance = document.createElement("markdown-viewer");
        await instance.connectedCallback();
        createMockChildren(instance);
    })

    it ("set markdown", async () => {
        await crs.call("markdown_viewer", "set_markdown", {
            element: instance,
            markdown: "# Heading"
        })

        assertEquals(instance.shadowRoot.querySelector("article").innerHTML, "<h1>Heading</h1>\n");
    })
})