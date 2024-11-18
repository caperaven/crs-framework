import { assertEquals, assert } from "https://deno.land/std/testing/asserts.ts";
import { SchemaManager } from "./../../../src/schema/schema-manager.js";
import { ValidationResult } from "./../../../src/schema/validation-result.js";

import { InputProvider } from "../../../src/schema/providers/input.js";

globalThis.crsbinding = {
    events: {
        emitter: {
            on: () => {
                return new Promise(resolve => resolve())
            },
            remove: () => {
                return new Promise(resolve => resolve())
            },
        }
    }
}

Deno.test("SchemaManager.parse should generate HTML code from schema", async () => {
    const schemaManager = new SchemaManager();
    schemaManager.registerProvider(InputProvider);

    const schemaJson = {
        body: {
            elements: [
                {
                    element: "div",
                    elements: [
                        {
                            "element": "h1",
                            "content": "Hello World"
                        }
                    ]
                }
            ]
        }
    };

    schemaManager.registerSchema("test", schemaJson);
    const result = await schemaManager.parse("test");
    assert(ValidationResult.isSuccess(result));
        assertEquals(result.message, "<div><h1>Hello World</h1></div>");

    schemaManager.dispose();
});

Deno.test("SchemaManager.parse input scenario", async () => {
    const schemaManager = new SchemaManager();
    schemaManager.registerProvider(InputProvider);

    const schemaJson = {
        body: {
            elements: [
                {
                    element: "div",
                    elements: [
                        {
                            "element": "input",
                            "field": "model.firstName",
                            "title": "First Name",
                        }
                    ]
                }
            ]
        }
    };

    schemaManager.registerSchema("test", schemaJson);

    const result = await schemaManager.parse("test");
    assert(ValidationResult.isSuccess(result));

    assert(result.message.indexOf("<input type=\"text\" value.bind=\"model.firstName\" />")) > -1;
    schemaManager.dispose();
});

Deno.test("SchemaManager.validate should validate the entire schema", () => {
    const schemaManager = new SchemaManager();
    const schemaJson = { /* your schema JSON here */ };
    const result = schemaManager.validate(schemaJson);
    assertEquals(result, ValidationResult.success("success"));
    schemaManager.dispose();
});

Deno.test("SchemaManager.validate should validate a part of the schema", () => {
    const schemaManager = new SchemaManager();
    const schemaJson = { /* your schema JSON here */ };
    const path = "some.path";
    const result = schemaManager.validate(schemaJson, path);
    assertEquals(result, ValidationResult.success("success"));
    schemaManager.dispose();
});

Deno.test("SchemaManager.setAttribute should set an attribute in the schema", () => {
    const schemaManager = new SchemaManager();
    const schemaJson = {
        body: {
            elements: [
                {
                    element: "div",
                    id: "testDiv"
                }
            ]
        }
    };

    schemaManager.registerSchema("test", schemaJson);

    const path = "/0";
    const attributeName = "data-test";
    const attributeValue = "test-value";

    const result = schemaManager.setAttribute("test", path, attributeName, attributeValue);
    assertEquals(result, ValidationResult.success("success"));

    assertEquals(schemaJson.body.elements[0].attributes["data-test"], "test-value");

    schemaManager.dispose();
});

Deno.test("SchemaManager.deleteAttribute should delete an attribute in the schema", () => {
    const schemaManager = new SchemaManager();
    const schemaJson = {
        body: {
            elements: [
                {
                    element: "div",
                    id: "testDiv",
                    attributes: {
                        "data-test": "test-value"
                    }
                }
            ]
        }
    };

    schemaManager.registerSchema("test", schemaJson);

    const path = "/0";
    const attributeName = "data-test";

    const result = schemaManager.deleteAttribute("test", path, attributeName);
    assertEquals(result, ValidationResult.success("success"));
    assertEquals(schemaJson.body.elements[0].attributes["data-test"], undefined);

    schemaManager.dispose();
});

Deno.test("SchemaManager.addStyle should add a style class to the schema item", () => {
    const schemaManager = new SchemaManager();
    const schemaJson = {
        body: {
            elements: [
                {
                    element: "div",
                    id: "testDiv"
                }
            ]
        }
    };

    schemaManager.registerSchema("test", schemaJson);

    const path = "/0";
    const className = "test-class";

    const result = schemaManager.addStyle("test", path, className);
    assertEquals(result, ValidationResult.success("success"));
    assert(schemaJson.body.elements[0].styles.includes("test-class"));

    schemaManager.dispose();
});

Deno.test("SchemaManager.deleteStyle should delete a style class from the schema item", () => {
    const schemaManager = new SchemaManager();
    const schemaJson = {
        body: {
            elements: [
                {
                    element: "div",
                    id: "testDiv",
                    styles: ["test-class"]
                }
            ]
        }
    };

    schemaManager.registerSchema("test", schemaJson);

    const path = "/0";
    const className = "test-class";

    const result = schemaManager.deleteStyle("test", path, className);
    assertEquals(result, ValidationResult.success("success"));
    assert(schemaJson.body.elements[0].styles.length === 0);

    schemaManager.dispose();
});

Deno.test("SchemaManager.setStyleProperty should set a style property in the schema item", () => {
    const schemaManager = new SchemaManager();
    const schemaJson = {
        body: {
            elements: [
                {
                    element: "div",
                    id: "testDiv"
                }
            ]
        }
    };

    schemaManager.registerSchema("test", schemaJson);

    const path = "/0";
    const propertyName = "color";
    const propertyValue = "red";

    const result = schemaManager.setStyleProperty("test", path, propertyName, propertyValue);
    assertEquals(result, ValidationResult.success("success"));
    assertEquals(schemaJson.body.elements[0].styleProperties.color, "red");

    schemaManager.dispose();
});

Deno.test("SchemaManager.deleteStyleProperty should delete a style property from the schema item", () => {
    const schemaManager = new SchemaManager();
    const schemaJson = {
        body: {
            elements: [
                {
                    element: "div",
                    id: "testDiv",
                    styleProperties: {
                        color: "red"
                    }
                }
            ]
        }
    };

    schemaManager.registerSchema("test", schemaJson);

    const path = "/0";
    const propertyName = "color";

    const result = schemaManager.deleteStyleProperty("test", path, propertyName);
    assertEquals(result, ValidationResult.success("success"));
    assertEquals(schemaJson.body.elements[0].styleProperties.color, undefined);

    schemaManager.dispose();
});

Deno.test("SchemaManager.create should create a new element in the schema", async () => {
    const schemaManager = new SchemaManager();
    schemaManager.registerProvider(InputProvider);

    const schemaJson = {
        body: {
            elements: []
        }
    };

    schemaManager.registerSchema("test", schemaJson);

    const path = "/";
    const schemaItem = {
        element: "input",
        field: "firstName",
        title: "First Name"
    };

    const result = await schemaManager.create("test", path, schemaItem);
    assertEquals(result, ValidationResult.success("success", path));
    assertEquals(schemaJson.body.elements[0], schemaItem);

    schemaManager.dispose();
});

Deno.test("SchemaManager.create should return an error if the schema item is invalid", async () => {
    const schemaManager = new SchemaManager();
    schemaManager.registerProvider(InputProvider);

    const schemaJson = {
        body: {
            elements: []
        }
    };

    schemaManager.registerSchema("test", schemaJson);

    const path = "/";
    const schemaItem = {
        element: "input",
        // Missing required fields
    };

    const result = await schemaManager.create("test", path, schemaItem);
    assertEquals(ValidationResult.isError(result), true);

    schemaManager.dispose();
});

Deno.test("SchemaManager.update should update an existing element in the schema", async () => {
    const schemaManager = new SchemaManager();
    schemaManager.registerProvider(InputProvider);

    const schemaJson = {
        body: {
            elements: [
                {
                    element: "input",
                    field: "firstName",
                    title: "First Name"
                }
            ]
        }
    };

    schemaManager.registerSchema("test", schemaJson);

    const path = "/0";
    const updatedSchemaItem = {
        element: "input",
        title: "Updated First Name"
    };

    const result = await schemaManager.update("test", path, updatedSchemaItem);
    assertEquals(result, ValidationResult.success("success", path));
    assertEquals(schemaJson.body.elements[0].title, "Updated First Name");

    schemaManager.dispose();
});

Deno.test("SchemaManager.update should return an error if the element does not exist", async () => {
    const schemaManager = new SchemaManager();
    schemaManager.registerProvider(InputProvider);

    const schemaJson = {
        body: {
            elements: []
        }
    };

    schemaManager.registerSchema("test", schemaJson);

    const path = "/0";
    const updatedSchemaItem = {
        element: "input",
        title: "Updated First Name"
    };

    const result = await schemaManager.update("test", path, updatedSchemaItem);
    assertEquals(ValidationResult.isError(result), true);

    schemaManager.dispose();
});

Deno.test("SchemaManager.delete should delete an existing element in the schema", async () => {
    const schemaManager = new SchemaManager();
    schemaManager.registerProvider(InputProvider);

    const schemaJson = {
        body: {
            elements: [
                {
                    element: "input",
                    field: "firstName",
                    title: "First Name"
                }
            ]
        }
    };

    schemaManager.registerSchema("test", schemaJson);

    const path = "/0";

    const result = await schemaManager.delete("test", path);
    assert(ValidationResult.success("success"));
    assertEquals(schemaJson.body.elements.length, 0);

    schemaManager.dispose();
});

Deno.test("SchemaManager.delete should return an error if the element does not exist", async () => {
    const schemaManager = new SchemaManager();
    schemaManager.registerProvider(InputProvider);

    const schemaJson = {
        body: {
            elements: []
        }
    };

    schemaManager.registerSchema("test", schemaJson);

    const path = "/0";

    const result = await schemaManager.delete("test", path);
    assert(ValidationResult.isError(result));

    schemaManager.dispose();
});