import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { ValidationResult } from "./../../../src/schema/validation-result.js";

Deno.test("ValidationResult.error should return an error object", () => {
    const message = "This is an error";
    const result = ValidationResult.error(message);
    assertEquals(result, { type: "error", message, path: "" });
});

Deno.test("ValidationResult.warning should return a warning object", () => {
    const message = "This is a warning";
    const result = ValidationResult.warning(message);
    assertEquals(result, { type: "warning", message, path: "" });
});

Deno.test("ValidationResult.success should return a success object", () => {
    const message = "This is a success";
    const result = ValidationResult.success(message);
    assertEquals(result, { type: "success", message, path: "" });
});