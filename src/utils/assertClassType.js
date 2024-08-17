export function assertClassType(value, className) {
    if (typeof value === className) {
        return value;
    }

    if (value == null) {
        throw new Error(`[assertClassType] value is null or undefined`);
    }

    if (typeof value !== "object") {
        throw new Error(`[assertClassType] value: ${value}, should be of type object`);
    }

    if (value.constructor.name !== className) {
        throw new Error(`[assertClassType] value: ${value}, should be of type ${className}`);
    }

    return value;
}