import { TemplatesManager } from "./../../../../src/schema/managers/templates.js";
import { assertEquals, assert } from "https://deno.land/std/testing/asserts.ts";
import { SchemaManager } from "../../../../src/schema/schema-manager.js";
import { init } from "./../../../mockups/init.js";
import { beforeAll, afterAll, describe, it } from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { ValidationResult } from "../../../../src/schema/validation-result.js";

await init();

let schemaManager;
let schema = {
    body: {
        elements: [
            {
                "element": "input",
                "title": "@person.firstName"
            }
        ]
    }
};
let templatesManager;

beforeAll(() => {
    templatesManager = new TemplatesManager();
    schemaManager = new SchemaManager();
    schemaManager.registerSchema("schema1", schema);
});

afterAll(() => {
    schemaManager.unregisterSchema("schema1");
    schemaManager = schemaManager.dispose();
});

describe("TemplatesManager", () => {
    it("TemplatesManager.create", async () => {
        const result = await templatesManager.create("schema1", "template1", "<div></div>");
        assertEquals(result.message, "success");
        assertEquals(schema.templates.template1, "<div></div>");
    });

    it("TemplatesManager.update", async () => {
        // todo
    });

    it("TemplatesManager.get", async () => {
        await templatesManager.create("schema1", "template1", "<div></div>");
        const result = await templatesManager.get("schema1", "template1");
        assertEquals(result.message, "<div></div>");
    });

    it("TemplatesManager.delete", async () => {
        await templatesManager.create("schema1", "template1", "<div></div>");
        await templatesManager.delete("schema1", "template1");

        const result = await templatesManager.get("schema1", "template1");
        assertEquals(result.message, undefined);
        assertEquals(schema.templates, {});
    });

    it("TemplatesManager.clean", async () => {
        await templatesManager.create("schema1", "template1", "<div></div>");
        await templatesManager.create("schema1", "template2", "<span></span>");
        await templatesManager.clean("schema1");
        assertEquals(schema.templates, {});
    });

    it("TemplatesManager.validate", async () => {
        const result = await templatesManager.validate("schema1");
        assertEquals(result.message, "success");
    });
});