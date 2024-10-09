import { assertEquals, assertExists, assertNotEquals } from "https://deno.land/std@0.149.0/testing/asserts.ts";
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

Deno.test("PerspectiveBuilder - setGroup", () => {
    const perspective = new PerspectiveBuilder().setGroup(["group1", "group2"]).build();
    assertEquals(perspective.group, ["group1", "group2"]);
});

Deno.test("PerspectiveBuilder - setGroup with empty array", () => {
    const perspective = new PerspectiveBuilder().setGroup([]).build();
    assertEquals(perspective.group, undefined);
});

Deno.test("PerspectiveBuilder - clearGroup", () => {
    const perspective = new PerspectiveBuilder({ group: ["group1"] }).clearGroup().build();
    assertEquals(perspective.group, undefined);
});

Deno.test("PerspectiveBuilder - appendGroup", () => {
    const perspective = new PerspectiveBuilder({ group: ["group1"] }).appendGroup("group2").build();
    assertEquals(perspective.group, ["group1", "group2"]);
});

Deno.test("PerspectiveBuilder - appendGroup with no initial group", () => {
    const perspective = new PerspectiveBuilder().appendGroup("group1").build();
    assertEquals(perspective.group, ["group1"]);
});

Deno.test("PerspectiveBuilder - removeGroup", () => {
    const perspective = new PerspectiveBuilder({ group: ["group1", "group2"] }).removeGroup("group1").build();
    assertEquals(perspective.group, ["group2"]);
});

Deno.test("PerspectiveBuilder - removeGroup with non-existing group", () => {
    const perspective = new PerspectiveBuilder({ group: ["group1"] }).removeGroup("group2").build();
    assertEquals(perspective.group, ["group1"]);
});

Deno.test("PerspectiveBuilder - removeGroup with all groups", () => {
    const perspective = new PerspectiveBuilder({ group: ["group1", "group2"] }).removeGroup("group1", "group2").build();
    assertEquals(perspective.group, undefined);
});

Deno.test("PerspectiveBuilder - setFuzzyFilter", () => {
    const perspective = new PerspectiveBuilder().setFuzzyFilter("test").build();
    assertEquals(perspective.fuzzyFilter, "test");
});

Deno.test("PerspectiveBuilder - setFuzzyFilter with empty string", () => {
    const perspective = new PerspectiveBuilder().setFuzzyFilter("").build();
    assertEquals(perspective.fuzzyFilter, undefined);
});

Deno.test("PerspectiveBuilder - setFuzzyFilter with null", () => {
    const perspective = new PerspectiveBuilder().setFuzzyFilter(null).build();
    assertEquals(perspective.fuzzyFilter, undefined);
});

Deno.test("PerspectiveBuilder - setFuzzyFilter with undefined", () => {
    const perspective = new PerspectiveBuilder().setFuzzyFilter(undefined).build();
    assertEquals(perspective.fuzzyFilter, undefined);
});

Deno.test("PerspectiveBuilder - clearFuzzyFilter", () => {
    const perspective = new PerspectiveBuilder({ fuzzyFilter: "test" }).clearFuzzyFilter().build();
    assertEquals(perspective.fuzzyFilter, undefined);
});

Deno.test("PerspectiveBuilder - clearFuzzyFilter with no initial fuzzyFilter", () => {
    const perspective = new PerspectiveBuilder().clearFuzzyFilter().build();
    assertEquals(perspective.fuzzyFilter, undefined);
});

Deno.test("PerspectiveBuilder - setFilter", () => {
    const perspective = new PerspectiveBuilder().setFilter({ field: "value" }).build();
    assertEquals(perspective.filter, { field: "value" });
});

Deno.test("PerspectiveBuilder - setFilter with null", () => {
    const perspective = new PerspectiveBuilder().setFilter(null).build();
    assertEquals(perspective.filter, undefined);
});

Deno.test("PerspectiveBuilder - setFilter with undefined", () => {
    const perspective = new PerspectiveBuilder().setFilter(undefined).build();
    assertEquals(perspective.filter, undefined);
});

Deno.test("PerspectiveBuilder - clearFilter", () => {
    const perspective = new PerspectiveBuilder({ filter: { field: "value" } }).clearFilter().build();
    assertEquals(perspective.filter, undefined);
});

Deno.test("PerspectiveBuilder - clearFilter with no initial filter", () => {
    const perspective = new PerspectiveBuilder().clearFilter().build();
    assertEquals(perspective.filter, undefined);
});

// Fail examples
Deno.test("PerspectiveBuilder - setFilter fail example", () => {
    const perspective = new PerspectiveBuilder().setFilter({ field: "value" }).build();
    assertNotEquals(perspective.filter, { field: "wrongValue" });
});

Deno.test("PerspectiveBuilder - clearFilter fail example", () => {
    const perspective = new PerspectiveBuilder({ filter: { field: "value" } }).clearFilter().build();
    assertNotEquals(perspective.filter, { field: "value" });
});

// Tests for appendFilter
Deno.test("PerspectiveBuilder - appendFilter", () => {
    const perspective = new PerspectiveBuilder().appendFilter({ field: "value1" }).build();
});

Deno.test("PerspectiveBuilder - appendFilter with existing filters", () => {
    const perspective = new PerspectiveBuilder({ filter: [{ field: "value1" }] }).appendFilter({ field: "value2" }).build();
});

Deno.test("PerspectiveBuilder - appendFilter with no initial filter", () => {
    const perspective = new PerspectiveBuilder().appendFilter({ field: "value1" }).build();
});

// Fail examples for appendFilter
Deno.test("PerspectiveBuilder - appendFilter fail example", () => {
    const perspective = new PerspectiveBuilder().appendFilter({ field: "value1" }).build();
});

// Tests for removeFilter
Deno.test("PerspectiveBuilder - removeFilter", () => {
    const perspective = new PerspectiveBuilder({ filter: [{ field: "value1" }, { field: "value2" }] }).removeFilter({ field: "value1" }).build();
});

Deno.test("PerspectiveBuilder - removeFilter with non-existing filter", () => {
    const perspective = new PerspectiveBuilder({ filter: [{ field: "value1" }] }).removeFilter({ field: "value2" }).build();
});

Deno.test("PerspectiveBuilder - removeFilter with all filters", () => {
    const perspective = new PerspectiveBuilder({ filter: [{ field: "value1" }, { field: "value2" }] }).removeFilter({ field: "value1" }, { field: "value2" }).build();
});

// Fail examples for removeFilter
Deno.test("PerspectiveBuilder - removeFilter fail example", () => {
    const perspective = new PerspectiveBuilder({ filter: [{ field: "value1" }, { field: "value2" }] }).removeFilter({ field: "value1" }).build();
});