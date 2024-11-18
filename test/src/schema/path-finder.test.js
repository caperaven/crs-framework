import { assertEquals, assert } from "https://deno.land/std/testing/asserts.ts";
import {schemaItemAt} from "../../../src/schema/path-finder.js";

const schema1 = {
    body: {
        elements: [
            {
                element: "div",
                id: "my-div",
                elements: [
                    {
                        element: "h1",
                        content: "Hello World"
                    },
                    {
                        element: "group",
                        actions: [
                            {
                                "element": "button",
                                "action": "click"
                            },
                            {
                                "id": "btnDblClick",
                                "element": "button",
                                "action": "dblclick"
                            }
                        ],
                        elements: [
                            {
                                element: "p",
                                content: "This is a paragraph"
                            },
                            {
                                element: "p",
                                content: "This is another paragraph"
                            }
                        ]
                    }
                ]
            }
        ]
    }
}

Deno.test("PathFinder - find by index", async () => {
    // note that we in this case add a "/" at the end of the path
    // the function should be able to handle this though you could have just set it to "0"
    const element = schemaItemAt(schema1, "/0/");
    assertEquals(element.element , "div");
    assertEquals(element.id , "my-div");

    const element2 = schemaItemAt(schema1, "/0");
    assertEquals(element2.element , "div");
    assertEquals(element2.id , "my-div");

    const element3 = schemaItemAt(schema1, "0");
    assertEquals(element3.element , "div");
    assertEquals(element3.id , "my-div");
});

Deno.test("PathFinder - find by id", async () => {
    const element = schemaItemAt(schema1, "#my-div");
    assertEquals(element.element, "div");
    assertEquals(element.id, "my-div");
});

Deno.test("PathFinder - find on path", async () => {
    const element = schemaItemAt(schema1, "#my-div/0");
    assertEquals(element.element, "h1");
    assertEquals(element.content, "Hello World");
});

Deno.test("PathFinder - find on path with property", async () => {
    const element = schemaItemAt(schema1, "#my-div/1/actions/element=button&action=click");
    assertEquals(element.element, "button");
    assertEquals(element.action, "click");

    const element2 = schemaItemAt(schema1, "#my-div/1/actions/#btnDblClick");
    assertEquals(element2.element, "button");
    assertEquals(element2.action, "dblclick");
})

