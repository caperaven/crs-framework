import {validate} from "../../../src/schema/validation.js";
import {ValidationResult} from "../../../src/schema/validation-result.js";
import { assert } from "https://deno.land/std/testing/asserts.ts";


Deno.test("validate - success", async () => {
    const schema = {
        field: "firstName",
        title: "First Name"
    }

    const def = {
        field: { type: "string", critical: true },
        title: { type: "string", critical: true },
    }

    const result = validate(schema, def);
    assert(ValidationResult.isSuccess(result));
})

Deno.test("validate - error", async () => {
    const schema = {
        field: "firstName"
    }

    const def = {
        field: { type: "string", critical: true },
        title: { type: "string", critical: true },
    }

    const result = validate(schema, def);
    assert(ValidationResult.isError(result));
    assert(result.message === '"title" is required');
})

Deno.test("validate - warning", async () => {
    const schema = {
        field: "firstName",
        title: "First Name"
    }

    const def = {
        field: { type: "string", critical: true },
        title: { type: "string", critical: true },
        placeholder: { type: "string", critical: false },
    }

    const result = validate(schema, def);
    assert(ValidationResult.isWarning(result));
    assert(result.message === '"placeholder" is required');
})