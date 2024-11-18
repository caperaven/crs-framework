import {ValidationResult} from "./validation-result.js";

export function validate(schemaItem, def, path) {
    for (const key in def) {
        const isCritical = def[key].critical ?? null;
        const hasValue = containsValue(schemaItem[key]);

        if (isCritical === true && !hasValue) {
            return ValidationResult.error(`"${key}" is required`, path);
        }

        if (isCritical === false && !hasValue) {
            return ValidationResult.warning(`"${key}" is required`, path);
        }

        const expectedType = def[key].type ?? "string";
        const actualType = typeof schemaItem[key];
        if (expectedType !== actualType && schemaItem[key] != null) {

            return ValidationResult.error(`"${key}" is of type "${actualType}" but should be of type "${expectedType}"`, path);
        }
    }

    return ValidationResult.success("valid", path);
}

function containsValue(value) {
    if (value == null) return false;
    return !(typeof value === "string" && value.trim() === "");
}