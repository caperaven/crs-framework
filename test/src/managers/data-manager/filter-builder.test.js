import { assertEquals, assertExists, assertNotEquals } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {FilterBuilder} from "../../../../src/managers/data-manager/filter-builder.js";

Deno.test("FilterBuilder - simple create - string", () => {
    const filter = new FilterBuilder("code eq 'test'").build();
    assertExists(filter);
    assertEquals(filter.field, "code");
    assertEquals(filter.operator, "eq");
    assertEquals(filter.value, "test");
})

Deno.test("FilterBuilder - simple create - boolean", () => {
    const falseFilter = new FilterBuilder("isActive eq false").build();
    assertExists(falseFilter);
    assertEquals(falseFilter.field, "isActive");
    assertEquals(falseFilter.operator, "eq");
    assertEquals(falseFilter.value, false);

    const trueFilter = new FilterBuilder("isActive eq true").build();
    assertExists(trueFilter);
    assertEquals(trueFilter.field, "isActive");
    assertEquals(trueFilter.operator, "eq");
    assertEquals(trueFilter.value, true);
})

Deno.test("FilterBuilder - simple create - number", () => {
    const filter = new FilterBuilder("age eq 10").build();
    assertExists(filter);
    assertEquals(filter.field, "age");
    assertEquals(filter.operator, "eq");
    assertEquals(filter.value, 10);
})