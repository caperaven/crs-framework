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
    let instance,listContainer;

    beforeEach(async () => {
        const listContainer = document.createElement("div");
        listContainer.id = "target";

        document.appendChild(listContainer);

        createChildrenFromHtml(listContainer, [
            '<ul data-id="view1" id="view-one"><li>View 1</li></ul>',
            '<ul data-id="view2" id="view-two"><li>View 2</li></ul>',
            '<ul data-id="view3" id="view-three"><li>View 3</li></ul>'
        ].join(" "), false);


        instance = document.createElement("tab-list");
        instance.setAttribute("for", "#target");

        createChildrenFromHtml(instance, [
            '<tab data-view="view1" aria-selected="true">&{tab.view1}</tab>',
            '<tab data-view="view2">&{tab.view2}</tab>',
            '<tab data-view="view3">&{tab.view3}</tab>'
        ].join(" "));

        document.appendChild(instance);
    })

    it("tablist - select the first list item", async () => {
        const listItemContainer = await setInitialMockFunctions(document, instance, 0);
        await instance.connectedCallback();

        const selected = instance.shadowRoot.querySelectorAll("[aria-selected='true']");

        assertEquals(selected.length, 1);
        assertEquals(selected[0].dataset.view, "view1");
        assertEquals(listItemContainer.children[0].hidden, false);

        assertEquals(listItemContainer.children[1].hidden, true);
        assertEquals(listItemContainer.children[2].hidden, true);
    });

    it("tablist - select the second list item", async () => {
        const listItemContainer = await setInitialMockFunctions(document, instance, 1);
        await instance.connectedCallback();

        await instance.performEvent("click", instance.shadowRoot.children[1]);

        const selected = instance.shadowRoot.querySelectorAll("[aria-selected='true']");
        assertEquals(selected.length, 1);
        assertEquals(selected[0].dataset.view, "view2");
        assertEquals(listItemContainer.children[1].hidden, false);

        assertEquals(listItemContainer.children[0].hidden, true);
        assertEquals(listItemContainer.children[2].hidden, true);
    });

    it("tablist - select the third list item", async () => {
        const listItemContainer = await setInitialMockFunctions(document, instance, 2);
        await instance.connectedCallback();

        await instance.performEvent("click", instance.shadowRoot.children[2]);

        const selected = instance.shadowRoot.querySelectorAll("[aria-selected='true']");
        assertEquals(selected.length, 1);
        assertEquals(selected[0].dataset.view, "view3");
        assertEquals(listItemContainer.children[2].hidden, false);

        assertEquals(listItemContainer.children[0].hidden, true);
        assertEquals(listItemContainer.children[1].hidden, true);
    });
});

async function setInitialMockFunctions(document, instance, itemIndex) {
    const listItemContainer = document.body.children[0]
    instance.target = listItemContainer;
    instance.querySelector = () => {
        return instance.shadowRoot.children[itemIndex];
    }

    listItemContainer.querySelectorAll = () => {
        return listItemContainer.children;
    }

    return listItemContainer;
}