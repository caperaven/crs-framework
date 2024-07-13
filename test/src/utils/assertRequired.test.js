import { assertRequired } from "../../../src/utils/assertRequired.js";
import {
    assertEquals,
    assertThrows,
} from "https://deno.land/std@0.224.0/testing/asserts.ts";

Deno.test("assertRequired throws error if value is null", () => {
    assertThrows(() => {
        assertRequired(null, "test", "Value is required");
    });
});

Deno.test("assertRequired throws error if value is undefined", () => {
    assertThrows(() => {
        assertRequired(undefined, "test", "Value is required");
    });
});

Deno.test("assertRequired throws error if value is an empty string and allowEmpty is false", () => {
    assertThrows(() => {
        assertRequired("", "test", "Value cannot be empty", false);
    });
});

Deno.test("assertRequired does not throw error if value is an empty string and allowEmpty is true", () => {
    assertEquals(assertRequired("", "test", "Value can be empty", true), "");
});

Deno.test("assertRequired does not throw error for valid non-empty string values", () => {
    assertEquals(assertRequired("valid value", "test", "Value is valid"), "valid value");
});

Deno.test("assertRequired does not throw error for non-string values", () => {
    assertEquals(assertRequired(123, "test", "Value is valid"), 123);
    assertEquals(assertRequired(true, "test", "Value is valid"), true);
    assertEquals(assertRequired({}, "test", "Value is valid"), {});
});

Deno.test("assertRequired with wrong data type", () => {
    const result = assertThrows(() => {
        assertRequired("123", "test", "Value is valid", false, "number")
    });

    assertEquals(result.message, "[test] value: 123, should be of type number");
});