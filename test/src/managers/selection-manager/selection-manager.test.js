import {beforeAll, beforeEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {assertEquals} from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {ElementMock} from "../../../mockups/element-mock.js";
import {init} from "../../../mockups/init.js";

await init();

beforeAll(async () => {
    await import("./../../../../src/actions/selection-actions.js");
})

describe("selection manager init tests", () => {
    let container;

    beforeEach(async () => {
        container = new ElementMock("div", {id: "container"});

        //querySelectors on container
        container.querySelector = (query) => {return null};
        container.querySelectorAll = (query) => {return {length: 0}};
    })

    it ("selection-manager adds event listener to parent on enable", async() => {
        //Act
        await crs.call("selection", "enable", {
            element: container
        });

        //Assert
        assertEquals(container.__events.length, 1);
    });

    it ("selection-manager removes event listener to parent on disable", async() => {
        //Act
        await crs.call("selection", "enable", {
            element: container
        });

        await crs.call("selection", "disable", {
            element: container
        });

        //Assert
        assertEquals(container.__events.length, 0);
    });
})

describe("selection manager state tests - w/li child elements", () => {
    let container, masterCheckbox, item1, item2, checkboxModule;

    beforeEach(async () => {
        container = new ElementMock("div", {id: "container"});
        const intentOptions = {
            element: container,
            master_query: "[data-value='master']",
            master_attribute: "aria-checked",
            item_query: "li",
            item_attribute: "aria-selected",
        }

        masterCheckbox = new ElementMock("check-box", {id: "master"}, container);
        masterCheckbox.setAttribute("data-value", "master");

        item1 = new ElementMock("li", {id: "item1"}, container);
        item2 = new ElementMock("li", {id: "item2"}, container);
        item1.setAttribute("data-value", "item1");
        item2.setAttribute("data-value", "item2");

        //matches
        masterCheckbox.matches = (query) => {return (query === intentOptions.master_query)};
        item1.matches = (query) => {return (query === intentOptions.item_query)};
        item2.matches = (query) => {return (query === intentOptions.item_query)};

        //querySelectors on container
        container.querySelector = (query) => {
            if (query === intentOptions.master_query) {
                return masterCheckbox;
            }
        }
        container.querySelectorAll = (query) => {
            if (query === intentOptions.master_query) {
                return [masterCheckbox];
            } else if (query === intentOptions.item_query) {
                return [item1, item2];
            } else {
                return [];
            }
        }

        //eventListeners on child elements
        masterCheckbox.addEventListener("click", async () => {
            masterCheckbox.setAttribute("aria-checked", masterCheckbox.getAttribute("aria-checked") === "true" ? "false" : "true");
            await container.dispatchEvent("checkedChange", {detail: {target: masterCheckbox}});
        });
        item1.addEventListener("click", async () => {
            item1.setAttribute("aria-selected", item1.getAttribute("aria-selected") === "true" ? "false" : "true");
            await container.dispatchEvent("checkedChange", {detail: {target: item1}});
        });
        item2.addEventListener("click", async () => {
            item2.setAttribute("aria-selected", item2.getAttribute("aria-selected") === "true" ? "false" : "true");
            await container.dispatchEvent("checkedChange", {detail: {target: item2}});
        });

        await crs.call("selection", "enable", intentOptions);
    })

    it ("master checkbox toggled to true, child li should be toggled true", async() => {
        //Arrange
        masterCheckbox.setAttribute("aria-checked", "false");

        //Act
        await masterCheckbox.dispatchEvent("click");

        //Assert
        assertEquals(masterCheckbox.getAttribute("aria-checked"), "true");

        assertEquals(item1.getAttribute("aria-selected"), "true");
        assertEquals(item2.getAttribute("aria-selected"), "true");
    });

    it ("master checkbox toggled to false, child li should be toggled false", async() => {
        //Arrange
        masterCheckbox.setAttribute("aria-checked", "true");
        item1.setAttribute("aria-selected", "true");
        item2.setAttribute("aria-selected", "true");

        //Act
        await masterCheckbox.dispatchEvent("click");

        //Assert
        assertEquals(masterCheckbox.getAttribute("aria-checked"), "false");
        assertEquals(item1.getAttribute("aria-selected"), "false");
        assertEquals(item2.getAttribute("aria-selected"), "false");
    });

    it ("all child li toggled to true, master checkbox should be toggled true", async() => {
        //Act
        await item1.dispatchEvent("click");
        await item2.dispatchEvent("click");

        //Assert
        assertEquals(masterCheckbox.getAttribute("aria-checked"), "true");
        assertEquals(item1.getAttribute("aria-selected"), "true");
        assertEquals(item2.getAttribute("aria-selected"), "true");
    });

    it ("all child li toggled to fasle, master checkbox should be toggled fasle", async() => {
        //Arrange
        item1.setAttribute("aria-selected", "true");
        item2.setAttribute("aria-selected", "true");

        //Act
        await item1.dispatchEvent("click");
        await item2.dispatchEvent("click");

        //Assert
        assertEquals(masterCheckbox.getAttribute("aria-checked"), "false");
        assertEquals(item1.getAttribute("aria-selected"), "false");
        assertEquals(item2.getAttribute("aria-selected"), "false");
    });

    it ("one child li toggled to true, one toggled to false, master checkbox should be toggled mixed", async() => {
        //Act
        await item1.dispatchEvent("click");

        //Assert
        assertEquals(masterCheckbox.getAttribute("aria-checked"), "mixed");
        assertEquals(item1.getAttribute("aria-selected"), "true");
        assertEquals(item2.getAttribute("aria-selected"), undefined);
    });

    it ("master checkbox set to mixed, toggled to true, child li should be toggled true", async() => {
        //Arrange
        masterCheckbox.setAttribute("aria-checked", "mixed");
        item1.setAttribute("aria-selected", "true");
        item2.setAttribute("aria-selected", "false");

        //Act
        await masterCheckbox.dispatchEvent("click");

        //Assert
        assertEquals(masterCheckbox.getAttribute("aria-checked"), "true");
        assertEquals(item1.getAttribute("aria-selected"), "true");
        assertEquals(item2.getAttribute("aria-selected"), "true");
    });

    it ("master checkbox set to mixed, child li toggle to true, master checkbox should be toggled true", async() => {
        //Arrange
        masterCheckbox.setAttribute("aria-checked", "mixed");
        item1.setAttribute("aria-selected", "true");
        item2.setAttribute("aria-selected", "false");

        //Act
        await item2.dispatchEvent("click");

        //Assert
        assertEquals(masterCheckbox.getAttribute("aria-checked"), "true");
        assertEquals(item1.getAttribute("aria-selected"), "true");
        assertEquals(item2.getAttribute("aria-selected"), "true");
    });

    it ("master checkbox set to mixed, child li toggle to false, master checkbox should be toggled false", async() => {
        //Arrange
        masterCheckbox.setAttribute("aria-checked", "mixed");
        item1.setAttribute("aria-selected", "true");
        item2.setAttribute("aria-selected", "false");

        //Act
        await item1.dispatchEvent("click");

        //Assert
        assertEquals(masterCheckbox.getAttribute("aria-checked"), "false");
        assertEquals(item1.getAttribute("aria-selected"), "false");
        assertEquals(item2.getAttribute("aria-selected"), "false");
    });
})