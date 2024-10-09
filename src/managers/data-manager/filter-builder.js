export class FilterBuilder {
    #expression;

    constructor(expression) {
        this.#expression = expression;
    }

    build() {
        return Object.freeze(buildIntent(this.#expression));
    }
}

function buildIntent(expression) {
    const containsAnd = expression.includes(" and ");
    const containsOr = expression.includes(" or ");

    // 1. does the expression have any "and" or "or" operators
    if (!containsAnd && !containsOr) {
        return expressionToObject(expression);
    }

    const isGrouped = expression.includes("(") && expression.includes(")");
    if (!isGrouped) {
        const operator = containsAnd ? "and" : "or";
        return parseOperatorSyntax(expression, operator);
    }
}

function parseOperatorSyntax(expression, operator) {
    const parts = expression.split(operator);

    const expressions = parts.map(part => {
        return buildIntent(part.trim());
    });

    return { operator, expressions }
}

/**
 * Convert an expression object to a filter intent object
 * For example, code eq 'abc' will be converted to { field: 'code', operator: 'eq', value: 'abc' }
 * @param expression
 */
function expressionToObject(expression) {
    // 1. extract the field, operator and value from the expression
    // 2. return an object with the field, operator and value

    const parts = expression.split(" ");
    const field = parts[0];
    const operator = parts[1];
    const value = sanitizeValue(parts[2]);

    return { field, operator, value }
}

function sanitizeValue(value) {
    if (value.startsWith("'") && value.endsWith("'") || value.startsWith('"') && value.endsWith('"')) {
        return value.slice(1, -1);
    }

    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
    if (!isNaN(value)) return Number(value);

    return value;
}

