import { assertClassType } from "../../../src/utils/assertClassType.js";
import {
    assertThrows,
    assertEquals,
} from "https://deno.land/std/testing/asserts.ts";

class TestClass {}

Deno.test("assertClassType - correctly asserts class type", () => {
    const instance = new TestClass();
    const result = assertClassType(instance, "TestClass");
    assertEquals(result, instance, "Should return the instance if it matches the class name");
});

Deno.test("assertClassType - throws error if value is null or undefined", () => {
    assertEquals(assertThrows(
        () => assertClassType(null, "TestClass")
    ).message, "[assertClassType] value is null or undefined");

    assertEquals(assertThrows(
        () => assertClassType(undefined, "TestClass"),
    ).message, "[assertClassType] value is null or undefined");
});

Deno.test("assertClassType - throws error if value is not an object", () => {
    const error = assertThrows(() => assertClassType(123, "TestClass"));
    assertEquals(error.message, "[assertClassType] value: 123, should be of type object");
});

Deno.test("assertClassType - throws error if instance does not match class name", () => {
    const instance = new TestClass();
    const error = assertThrows(() => assertClassType(instance, "AnotherClass"));
    assertEquals(error.message, "[assertClassType] value: [object Object], should be of type AnotherClass");
});