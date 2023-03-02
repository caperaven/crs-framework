import { beforeAll, beforeEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";
import {createChildrenFromHtml} from "../../mockups/child-mock-factory.js";
import {EventMock} from "../../mockups/event-mock.js";

await init();

beforeAll(async () => {
    await import("../../../components/tab-list/tab-list.js");
})

describe ("tab-list", async () => {
    let instance;
    let perspective;

    beforeEach(async () => {
        perspective = document.createElement("perspective-element");
        perspective.id = "target";
        document.appendChild(perspective);

        createChildrenFromHtml(perspective, [
            '<template data-id="view1" data-default="true"><h1>Template 1</h1></template>',
            '<template data-id="view2"><h1>Template 2</h1></template>',
            '<template data-id="view3"><h1>Template 3</h1></template>'
        ].join(" "), false)

        perspective.connectedCallback();

        instance = document.createElement("tab-list");
        instance.setAttribute("for", "#target");

        await instance.connectedCallback();

        createChildrenFromHtml(instance, [
            '<tab data-view="view1" aria-selected="true">&{tab.view1}</tab>',
            '<tab data-view="view2">&{tab.view2}</tab>',
            '<tab data-view="view3">&{tab.view3}</tab>'
        ].join(" "))
    })

    it("change", async () => {
        const selected = instance.shadowRoot.querySelectorAll("[aria-selected='true']");
        assertEquals(selected.length, 1);
        assertEquals(selected[0].dataset.view, "view1");
        assertEquals(perspective.children[0].textContent, "Template 1");

        await instance.performEvent("click", instance.shadowRoot.children[3]);
        const selected2 = instance.shadowRoot.querySelectorAll("[aria-selected='true']");
        assertEquals(selected2.length, 1);
        assertEquals(selected2[0].dataset.view, "view3");
        assertEquals(perspective.children[0].textContent, "Template 3");
    })
})