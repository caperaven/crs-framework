import {BaseProvider} from "../../../../src/schema/providers/base-provider.js";
import {ValidationResult} from "../../../../src/schema/validation-result.js";
import { assertEquals, assert, assertExists } from "https://deno.land/std/testing/asserts.ts";

Deno.test("BaseProvider:parse", async () => {
    const template = "<div>__field__</div>";
    const schemaItem = { field: "firstName" };
    const result = await BaseProvider.parse(template, schemaItem);

    assert(ValidationResult.isSuccess(result));
    assertEquals(result.message, "<div>firstName</div>");
});

Deno.test("BaseProvider:validate - valid", async () => {
    const result = await BaseProvider.validate({
        field: "firstName",
        title: "First Name",
        placeholder: "Enter your first name"
    }, "path");

    assert(ValidationResult.isSuccess(result));
});

Deno.test("BaseProvider:create", async () => {
    const schema = {
        body: {
            elements: []
        }
    }

    const schemaItem = {
        field: "firstName",
        title: "First Name",
        placeholder: "Enter your first name"
    };

    await BaseProvider.create(schema, "/", schemaItem);

    assertExists(schema.body.elements[0]);
    assertEquals(schema.body.elements[0].field, "firstName");
    assertEquals(schema.body.elements[0].title, "First Name");
});

Deno.test("BaseProvider:update", async () => {
    const schema = {
        body: {
            elements: [
                {
                    field: "firstName",
                    title: "First Name",
                    placeholder: "Enter your first name"
                }
            ]
        }
    }

    const schemaItem = {
        field: "lastName",
        title: "Last Name",
        placeholder: "Enter your last name"
    };

    await BaseProvider.update(schema, "/0", schemaItem, () => ValidationResult.success("success", "path"));

    assertExists(schema.body.elements[0]);
    assertEquals(schema.body.elements[0].field, "lastName");
    assertEquals(schema.body.elements[0].title, "Last Name");
    assertEquals(schema.body.elements[0].placeholder, "Enter your last name");
});

Deno.test("BaseProvider:delete", async () => {
    const schema = {
        body: {
            elements: [
                {
                    field: "firstName",
                    title: "First Name",
                    placeholder: "Enter your first name"
                }
            ]
        }
    }

    await BaseProvider.delete(schema, "/0");

    assertEquals(schema.body.elements.length, 0);
});
