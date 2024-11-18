import {InputProvider} from "../../../../src/schema/providers/input.js";
import {ValidationResult} from "../../../../src/schema/validation-result.js";
import { assertEquals, assert, assertExists } from "https://deno.land/std/testing/asserts.ts";


Deno.test("InputProvider:parse", async () => {
    const result = await InputProvider.parse({
        field: "firstName",
        title: "First Name",
        placeholder: "Enter your first name"
    }, "path");

    assert(result.message.length > 0);
});

Deno.test("InputProvider:validate - valid", async () => {
    const result = await InputProvider.validate({
        field: "firstName",
        title: "First Name",
        placeholder: "Enter your first name"
    }, "path");

    assert(ValidationResult.isSuccess(result));
});

Deno.test("InputProvider:validate - invalid", async () => {
    const result = await InputProvider.validate({
        field: "firstName"
    }, "path");

    assert(ValidationResult.isError(result));
    assertEquals(result.message, `"title" is required`);
});

Deno.test("InputProvider:create - valid", async () => {
    const schema = {
        body: {
            elements: []
        }
    }

    const result = await InputProvider.create(schema, "/", {
        field: "firstName",
        title: "First Name",
        placeholder: "Enter your first name"
    })

    assert(ValidationResult.isSuccess(result));
    assertExists(schema.body.elements[0])
    assertEquals(schema.body.elements[0].element, "input");
    assertEquals(schema.body.elements[0].field, "firstName");
    assertEquals(schema.body.elements[0].title, "First Name");
});

Deno.test("InputProvider:create - invalid", async () => {
    const schema = {
        body: {
            elements: []
        }
    }

    const result = await InputProvider.create(schema, "/", {
        field: "firstName",
    })

    assert(ValidationResult.isError(result));
    assertEquals(result.message, `"title" is required`);
    assertExists(schema.body.elements.length, 0);
});

Deno.test("InputProvider:update - valid", async () => {
    const schema = {
        body: {
            elements: [
                {
                    element: "input",
                    field: "firstName",
                    title: "First Name",
                    placeholder: "Enter your first name"
                }
            ]
        }
    }

    const result = await InputProvider.update(schema, "/0", {
        field: "lastName",
        title: "Last Name",
        placeholder: "Enter your last name"
    })

    assert(ValidationResult.isSuccess(result));

    assertExists(schema.body.elements[0])
    assertEquals(schema.body.elements[0].element, "input");
    assertEquals(schema.body.elements[0].field, "lastName");
    assertEquals(schema.body.elements[0].title, "Last Name");
    assertEquals(schema.body.elements[0].placeholder, "Enter your last name");
});

Deno.test("InputProvider:update - invalid", async () => {
    const schema = {
        body: {
            elements: [
                {
                    element: "input",
                    field: "firstName",
                    title: "First Name",
                    placeholder: "Enter your first name"
                }
            ]
        }
    }

    const result = await InputProvider.update(schema, "/0", {
        field: "",
    })

    assert(ValidationResult.isError(result));
    assertEquals(result.message, `"field" is required`);
    assertEquals(schema.body.elements[0].field, "firstName");
});

Deno.test("InputProvider:delete", async () => {
    const schema = {
        body: {
            elements: [
                {
                    element: "input",
                    field: "firstName",
                    title: "First Name",
                    placeholder: "Enter your first name"
                }
            ]
        }
    }

    const result = await InputProvider.delete(schema, "/0");

    assert(ValidationResult.isSuccess(result));
    assertEquals(schema.body.elements.length, 0);
});

