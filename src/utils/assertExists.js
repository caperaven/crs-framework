export function assertExists(value, message) {
    if (value == null) {
        throw new Error(message);
    }
    return value;
}