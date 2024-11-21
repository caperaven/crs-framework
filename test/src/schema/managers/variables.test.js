import { VariablesManager } from "./../../../../src/schema/managers/variables.js";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

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

Deno.test("VariablesManager.create", async () => {
    const manager = new VariablesManager();
    const result = await manager.create("schema1", "@person.firstName", "John");
    assertEquals(result.message, "success");
});

Deno.test("VariablesManager.update", async () => {
    const manager = new VariablesManager();
    const result = await manager.update("schema1", "@person.firstName", "Doe");
    assertEquals(result.message, "success");
});

Deno.test("VariablesManager.get", async () => {
    const manager = new VariablesManager();
    const result = await manager.get("schema1", "@person.firstName");
    assertEquals(result.message, "success");
});

Deno.test("VariablesManager.delete", async () => {
    const manager = new VariablesManager();
    const result = await manager.delete("schema1", "@person.firstName");
    assertEquals(result.message, "success");
});

Deno.test("VariablesManager.clean", async () => {
    const manager = new VariablesManager();
    const result = await manager.clean("schema1");
    assertEquals(result.message, "success");
});

Deno.test("VariablesManager.validate", async () => {
    const manager = new VariablesManager();
    const result = await manager.validate("schema1");
    assertEquals(result.message, "success");
});