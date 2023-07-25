import {beforeAll, afterAll, afterEach, beforeEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assertExists, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
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

// describe("selection manager state tests - w/checkbox child elements", () => {
//     let container, masterCheckbox, item1, item2, checkboxModule;
//
//     beforeEach(async () => {
//         container = new ElementMock("div", {id: "container"});
//
//         masterCheckbox = new ElementMock("check-box", {id: "master"}, container);
//         masterCheckbox.setAttribute("data-value", "master");
//
//         item1 = new ElementMock("check-box", {id: "item1"}, container);
//         item2 = new ElementMock("check-box", {id: "item2"}, container);
//         item1.setAttribute("data-value", "item1");
//         item2.setAttribute("data-value", "item2");
//
//         //matches
//         masterCheckbox.matches = (query) => {return (query === "[data-value='master']" || query === "check-box")};
//         item1.matches = (query) => {return (query === "check-box:not([data-value='master'])" || query === "check-box")};
//         item2.matches = (query) => {return (query === "check-box:not([data-value='master'])" || query === "check-box")};
//
//         //checked
//         Object.defineProperty(masterCheckbox, "checked", {
//             get() {
//                 return masterCheckbox._checked;
//             },
//
//             set(newValue) {
//                 masterCheckbox._checked = newValue;
//                 masterCheckbox.setAttribute("aria-checked", newValue);
//             }
//         });
//         Object.defineProperty(item1, "checked", {
//             get() {
//                 return item1._checked;
//             },
//
//             set(newValue) {
//                 item1._checked = newValue;
//                 item1.setAttribute("aria-checked", newValue);
//             }
//         });
//         Object.defineProperty(item2, "checked", {
//             get() {
//                 return item2._checked;
//             },
//
//             set(newValue) {
//                 item2._checked = newValue;
//                 item2.setAttribute("aria-checked", newValue);
//             }
//         });
//
//         //querySelector on container
//         container.querySelector = (query) => {
//             if (query === "[data-value='master']") {
//                 return masterCheckbox;
//             }
//         }
//
//         container.querySelectorAll = (query) => {
//             if (query === "[data-value='master']") {
//                 return [masterCheckbox];
//             } else if (query === "check-box:not([data-value='master'])") {
//                 return [item1, item2];
//             } else {
//                 return [];
//             }
//         }
//
//         await crs.call("selection", "enable", {
//             element: container,
//             master_query: "[data-value='master']",
//             master_selection_query: "[aria-checked]",
//             item_query: "check-box:not([data-value='master'])",
//             item_selection_query: "[aria-checked]",
//         });
//     })
//
//     it ("master checkbox toggled to true, child checkboxes should be toggled true", async() => {
//         //Arrange
//         masterCheckbox.setAttribute("aria-checked", "true");
//         await container.dispatchEvent("click", {composedPath: () => {return [masterCheckbox, container]}});
//
//         //Assert
//         assertEquals(masterCheckbox.getAttribute("aria-checked"), "true");
//         assertEquals(item1.getAttribute("aria-checked"), "true");
//         assertEquals(item2.getAttribute("aria-checked"), "true");
//     });
//
//     it ("master checkbox toggled to false, child checkboxes should be toggled false", async() => {
//         //Arrange
//         masterCheckbox.setAttribute("aria-checked", "false");
//         item1.setAttribute("aria-checked", "true");
//         item2.setAttribute("aria-checked", "true");
//
//         //Act
//         await container.dispatchEvent("click", {composedPath: () => {return [masterCheckbox, container]}});
//
//         //Assert
//         assertEquals(masterCheckbox.getAttribute("aria-checked"), "false");
//         assertEquals(item1.getAttribute("aria-checked"), "false");
//         assertEquals(item2.getAttribute("aria-checked"), "false");
//     });
//
//     it ("all child checkboxes toggled to true, master checkbox should be toggled true", async() => {
//         //Arrange
//         item1.setAttribute("aria-checked", "true");
//         item2.setAttribute("aria-checked", "true");
//
//         //Act
//         await container.dispatchEvent("click", {composedPath: () => {return [item1, container]}});
//         await container.dispatchEvent("click", {composedPath: () => {return [item2, container]}});
//
//         //Assert
//         assertEquals(masterCheckbox.getAttribute("aria-checked"), "true");
//         assertEquals(item1.getAttribute("aria-checked"), "true");
//         assertEquals(item2.getAttribute("aria-checked"), "true");
//     });
//
//     it ("all child checkboxes toggled to fasle, master checkbox should be toggled fasle", async() => {
//         //Arrange
//         item1.setAttribute("aria-checked", "false");
//         item2.setAttribute("aria-checked", "false");
//
//         //Act
//         await container.dispatchEvent("click", {composedPath: () => {return [item1, container]}});
//         await container.dispatchEvent("click", {composedPath: () => {return [item2, container]}});
//
//         //Assert
//         assertEquals(masterCheckbox.getAttribute("aria-checked"), "false");
//         assertEquals(item1.getAttribute("aria-checked"), "false");
//         assertEquals(item2.getAttribute("aria-checked"), "false");
//     });
//
//     it ("one child checkbox toggled to true, one toggled to false, master checkbox should be toggled mixed", async() => {
//         //Arrange
//         item1.setAttribute("aria-checked", "true");
//
//         //Act
//         await container.dispatchEvent("click", {composedPath: () => {return [item1, container]}});
//
//         //Assert
//         assertEquals(masterCheckbox.getAttribute("aria-checked"), "mixed");
//         assertEquals(item1.getAttribute("aria-checked"), "true");
//         assertEquals(item2.getAttribute("aria-checked"), undefined);
//     });
//
//     it ("master checkbox set to mixed, toggled to true, child checkboxes should be toggled true", async() => {
//         //Arrange
//         masterCheckbox.setAttribute("aria-checked", "true");
//         item1.setAttribute("aria-checked", "true");
//         item2.setAttribute("aria-checked", "false");
//
//         //Act
//         await container.dispatchEvent("click", {composedPath: () => {return [masterCheckbox, container]}});
//
//         //Assert
//         assertEquals(masterCheckbox.getAttribute("aria-checked"), "true");
//         assertEquals(item1.getAttribute("aria-checked"), "true");
//         assertEquals(item2.getAttribute("aria-checked"), "true");
//     });
//
//     it ("master checkbox set to mixed, child checkbox toggle to true, master checkbox should be toggled true", async() => {
//         //Arrange
//         masterCheckbox.setAttribute("aria-checked", "mixed");
//         item1.setAttribute("aria-checked", "true");
//         item2.setAttribute("aria-checked", "true");
//
//         //Act
//         await container.dispatchEvent("click", {composedPath: () => {return [item2, container]}});
//
//         //Assert
//         assertEquals(masterCheckbox.getAttribute("aria-checked"), "true");
//         assertEquals(item1.getAttribute("aria-checked"), "true");
//         assertEquals(item2.getAttribute("aria-checked"), "true");
//     });
//
//     it ("master checkbox set to mixed, child checkbox toggle to false, master checkbox should be toggled false", async() => {
//         //Arrange
//         masterCheckbox.setAttribute("aria-checked", "mixed");
//         item1.setAttribute("aria-checked", "false");
//         item2.setAttribute("aria-checked", "false");
//
//         //Act
//         await container.dispatchEvent("click", {composedPath: () => {return [item1, container]}});
//
//         //Assert
//         assertEquals(masterCheckbox.getAttribute("aria-checked"), "false");
//         assertEquals(item1.getAttribute("aria-checked"), "false");
//         assertEquals(item2.getAttribute("aria-checked"), "false");
//     });
// })

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

        //checked
        // Object.defineProperty(masterCheckbox, "checked", {
        //     get() {
        //         return masterCheckbox._checked;
        //     },
        //
        //     set(newValue) {
        //         masterCheckbox._checked = newValue;
        //         masterCheckbox.setAttribute("aria-checked", newValue);
        //     }
        // });
        // Object.defineProperty(item1, "checked", {
        //     get() {
        //         return item1._checked;
        //     },
        //
        //     set(newValue) {
        //         item1._checked = newValue;
        //         item1.setAttribute("aria-checked", newValue);
        //     }
        // });
        // Object.defineProperty(item2, "checked", {
        //     get() {
        //         return item2._checked;
        //     },
        //
        //     set(newValue) {
        //         item2._checked = newValue;
        //         item2.setAttribute("aria-checked", newValue);
        //     }
        // });

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

        await crs.call("selection", "enable", intentOptions);
    })

    it ("master checkbox toggled to true, child li should be toggled true", async() => {
        //Arrange
        await container.dispatchEvent("click", {composedPath: () => {return [masterCheckbox, container]}});

        //Assert
        assertEquals(masterCheckbox.getAttribute("aria-checked"), "true");

        assertEquals(item1.getAttribute("aria-selected"), "true");
        assertEquals(item2.getAttribute("aria-selected"), "true");
    });

    // it ("master checkbox toggled to false, child li should be toggled false", async() => {
    //     //Arrange
    //     masterCheckbox.setAttribute("aria-checked", "true");
    //     item1.setAttribute("aria-selected", "true");
    //     item2.setAttribute("aria-selected", "true");
    //
    //     //Act
    //     await container.dispatchEvent("click", {composedPath: () => {return [masterCheckbox, container]}});
    //
    //     //Assert
    //     assertEquals(masterCheckbox.getAttribute("aria-checked"), "false");
    //     assertEquals(item1.getAttribute("aria-selected"), "false");
    //     assertEquals(item2.getAttribute("aria-selected"), "false");
    // });
    //
    // it ("all child li toggled to true, master checkbox should be toggled true", async() => {
    //     //Act
    //     await container.dispatchEvent("click", {composedPath: () => {return [item1, container]}});
    //     await container.dispatchEvent("click", {composedPath: () => {return [item2, container]}});
    //
    //     //Assert
    //     assertEquals(masterCheckbox.getAttribute("aria-checked"), "true");
    //     assertEquals(item1.getAttribute("aria-selected"), "true");
    //     assertEquals(item2.getAttribute("aria-selected"), "true");
    // });
    //
    // it ("all child li toggled to fasle, master checkbox should be toggled fasle", async() => {
    //     //Arrange
    //     item1.setAttribute("aria-selected", "true");
    //     item2.setAttribute("aria-selected", "true");
    //
    //     //Act
    //     await container.dispatchEvent("click", {composedPath: () => {return [item1, container]}});
    //     await container.dispatchEvent("click", {composedPath: () => {return [item2, container]}});
    //
    //     //Assert
    //     assertEquals(masterCheckbox.getAttribute("aria-checked"), "false");
    //     assertEquals(item1.getAttribute("aria-selected"), "false");
    //     assertEquals(item2.getAttribute("aria-selected"), "false");
    // });
    //
    // it ("one child li toggled to true, one toggled to false, master checkbox should be toggled mixed", async() => {
    //     //Act
    //     await container.dispatchEvent("click", {composedPath: () => {return [item1, container]}});
    //
    //     //Assert
    //     assertEquals(masterCheckbox.getAttribute("aria-checked"), "mixed");
    //     assertEquals(item1.getAttribute("aria-selected"), "true");
    //     assertEquals(item2.getAttribute("aria-selected"), undefined);
    // });
    //
    // it ("master checkbox set to mixed, toggled to true, child li should be toggled true", async() => {
    //     //Arrange
    //     masterCheckbox.setAttribute("aria-checked", "mixed");
    //     item1.setAttribute("aria-selected", "true");
    //     item2.setAttribute("aria-selected", "false");
    //
    //     //Act
    //     await container.dispatchEvent("click", {composedPath: () => {return [masterCheckbox, container]}});
    //
    //     //Assert
    //     assertEquals(masterCheckbox.getAttribute("aria-checked"), "true");
    //     assertEquals(item1.getAttribute("aria-selected"), "true");
    //     assertEquals(item2.getAttribute("aria-selected"), "true");
    // });
    //
    // it ("master checkbox set to mixed, child li toggle to true, master checkbox should be toggled true", async() => {
    //     //Arrange
    //     masterCheckbox.setAttribute("aria-checked", "mixed");
    //     item1.setAttribute("aria-selected", "true");
    //     item2.setAttribute("aria-selected", "false");
    //
    //     //Act
    //     await container.dispatchEvent("click", {composedPath: () => {return [item2, container]}});
    //
    //     //Assert
    //     assertEquals(masterCheckbox.getAttribute("aria-checked"), "true");
    //     assertEquals(item1.getAttribute("aria-selected"), "true");
    //     assertEquals(item2.getAttribute("aria-selected"), "true");
    // });
    //
    // it ("master checkbox set to mixed, child li toggle to false, master checkbox should be toggled false", async() => {
    //     //Arrange
    //     masterCheckbox.setAttribute("aria-checked", "mixed");
    //     item1.setAttribute("aria-selected", "true");
    //     item2.setAttribute("aria-selected", "false");
    //
    //     //Act
    //     await container.dispatchEvent("click", {composedPath: () => {return [item1, container]}});
    //
    //     //Assert
    //     assertEquals(masterCheckbox.getAttribute("aria-checked"), "false");
    //     assertEquals(item1.getAttribute("aria-selected"), "false");
    //     assertEquals(item2.getAttribute("aria-selected"), "false");
    // });
})