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
    else {
        return parseGroupedSyntax(expression);
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
 * (code eq 'test' and isActive eq true) or (code eq 'test2)
 * this will generate
 * {
 *     operator: "or",
 *     expressions: [
 *     {
 *          operator: "and",
 *          expressions: [
 *              { field: "code", operator: "eq", value: "test" },
 *              { field: "isActive", operator: "eq", value: true }
 *          ]
 *     },
 *     { field: "code", operator: "eq", value: "test2" }
 * }
 * @param expression
 */
function parseGroupedSyntax(expression) {
    const parts = expression.split(")");

    const result = {
        operator: "and",
        expressions: []
    }

    for (let part of parts) {
        if (part.length === 0) continue;

        part = stripOpenBracket(part.trim());

        if (part.startsWith("and ")) {
            part = stripOpenBracket(part.slice(4).trim());
            result.operator = "and"
        }

        if (part.startsWith("or ")) {
            part = stripOpenBracket(part.slice(3).trim());
            result.operator = "or"
        }

        const intent = buildIntent(part.trim());
        result.expressions.push(intent);
    }

    return result;
}

function stripOpenBracket(expression) {
    return expression.startsWith("(") ? expression.slice(1) : expression;
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

