import { VariablesManager } from "./../../../../src/schema/managers/variables.js";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import {SchemaManager} from "../../../../src/schema/schema-manager.js";
import {init} from "./../../../mockups/init.js";
import { beforeAll, afterAll, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";

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
let variablesManager;

beforeAll(() => {
    variablesManager = new VariablesManager();
    schemaManager = new SchemaManager();
    schemaManager.registerSchema("schema1", schema);
})

afterAll(() => {
    schemaManager.unregisterSchema("schema1");
    schemaManager = schemaManager.dispose();
});

describe("VariablesManager", () => {
    it("VariablesManager.create", async () => {
        const result = await variablesManager.create("schema1", "@person.firstName", "John");
        assertEquals(result.message, "success");
        assertEquals(schema.variables.person.firstName, "John");
    });

    it("VariablesManager.update", async () => {
        const result = await variablesManager.update("schema1", "@person.firstName", "Jane");
        assertEquals(result.message, "success");
        assertEquals(schema.variables.person.firstName, "Jane");
    });

    it("VariablesManager.get", async () => {
        await variablesManager.create("schema1", "@person.firstName", "Chris");
        const result = await variablesManager.get("schema1", "@person.firstName");
        assertEquals(result.message, "Chris");
    });

    it("VariablesManager.delete", async () => {
        await variablesManager.create("schema1", "@person.firstName", "Chris");
        await variablesManager.delete("schema1", "@person.firstName");

        const result = variablesManager.get("schema1", "@person.firstName");
        assertEquals(result.message, undefined);
        assertEquals(schema.variables, {});
    });

    it("VariablesManager.clean", async () => {
        await variablesManager.create("schema1", "@value", 10);
        await variablesManager.create("schema1", "@person.firstName", "Pete");
        await variablesManager.create("schema1", "@person.firstName1", "John");
        await variablesManager.create("schema1", "@person.firstName2", "Jane");
        await variablesManager.create("schema1", "@person.firstNam3", "Chris");

        await variablesManager.clean("schema1");
        assertEquals(schema.variables, {
            person: { firstName: "Pete" }
        });
    });

    it("VariablesManager.validate", async () => {
        const result = await variablesManager.validate("schema1");
        assertEquals(result.message, "success");
    });
});

