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

Deno.test("FilterBuilder - and expression", () => {
    const filter = new FilterBuilder("code eq 'test' and isActive eq true").build();
    assertExists(filter);
    assertEquals(filter.operator, "and");
    assertEquals(filter.expressions.length, 2);

    assertEquals(filter.expressions[0].field, "code");
    assertEquals(filter.expressions[0].operator, "eq");
    assertEquals(filter.expressions[0].value, "test");

    assertEquals(filter.expressions[1].field, "isActive");
    assertEquals(filter.expressions[1].operator, "eq");
    assertEquals(filter.expressions[1].value, true);
})

Deno.test("FilterBuilder - or expression", () => {
    const filter = new FilterBuilder("code eq 'test' or isActive eq true").build();
    assertExists(filter);
    assertEquals(filter.operator, "or");
    assertEquals(filter.expressions.length, 2);

    assertEquals(filter.expressions[0].field, "code");
    assertEquals(filter.expressions[0].operator, "eq");
    assertEquals(filter.expressions[0].value, "test");

    assertEquals(filter.expressions[1].field, "isActive");
    assertEquals(filter.expressions[1].operator, "eq");
    assertEquals(filter.expressions[1].value, true);
})