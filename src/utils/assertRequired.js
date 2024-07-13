export function assertRequired(value, context, message, allowEmpty=false) {
    if (value == null) {
        throw new Error(`[${context}] ${message}`);
    }

    if (typeof value === "string") {
        value = value.trim();
        if (value === "" && !allowEmpty) {
            throw new Error(`[${context}] ${message}`);
        }
    }

    return value;
}