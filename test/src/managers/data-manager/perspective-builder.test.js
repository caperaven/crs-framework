import {beforeAll, afterAll, afterEach, beforeEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assertExists, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import { PerspectiveBuilder } from "../../../../src/managers/data-manager/perspective-builder.js";

Deno.test("PerspectiveBuilder - simple create", () => {
    const perspective = new PerspectiveBuilder().build();
    assertExists(perspective);
});

Deno.test("PerspectiveBuilder - create with definition", () => {
    const perspective = new PerspectiveBuilder({ sort: ["test"] }).build();
    assertEquals(perspective.sort, ["test"]);
});

Deno.test("PerspectiveBuilder - setSort", () => {
    const perspective = new PerspectiveBuilder().setSort(["field1:asc", "field2:desc"]).build();
    assertEquals(perspective.sort, ["field1:asc", "field2:desc"]);
});

Deno.test("PerspectiveBuilder - setSort with empty array", () => {
    const perspective = new PerspectiveBuilder().setSort([]).build();
    assertEquals(perspective.sort, undefined);
});

Deno.test("PerspectiveBuilder - clearSort", () => {
    const perspective = new PerspectiveBuilder({ sort: ["field1:asc"] }).clearSort().build();
    assertEquals(perspective.sort, undefined);
});

Deno.test("PerspectiveBuilder - appendSort", () => {
    const perspective = new PerspectiveBuilder({ sort: ["field1:asc"] }).appendSort("field2:desc").build();
    assertEquals(perspective.sort, ["field1:asc", "field2:desc"]);
});

Deno.test("PerspectiveBuilder - appendSort with no initial sort", () => {
    const perspective = new PerspectiveBuilder().appendSort("field1:asc").build();
    assertEquals(perspective.sort, ["field1:asc"]);
});

Deno.test("PerspectiveBuilder - removeSort", () => {
    const perspective = new PerspectiveBuilder({ sort: ["field1:asc", "field2:desc"] }).removeSort("field1:asc").build();
    assertEquals(perspective.sort, ["field2:desc"]);
});

Deno.test("PerspectiveBuilder - removeSort with non-existing field", () => {
    const perspective = new PerspectiveBuilder({ sort: ["field1:asc"] }).removeSort("field2:desc").build();
    assertEquals(perspective.sort, ["field1:asc"]);
});

Deno.test("PerspectiveBuilder - removeSort with all fields", () => {
    const perspective = new PerspectiveBuilder({ sort: ["field1:asc", "field2:desc"] }).removeSort("field1:asc", "field2:desc").build();
    assertEquals(perspective.sort, undefined);
});