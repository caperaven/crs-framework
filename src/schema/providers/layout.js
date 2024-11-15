import { ValidationResult } from "../validation-result.js";
import { BaseProvider } from "./base-provider.js";

export class LayoutProvider extends BaseProvider {
    static key = Object.freeze("layout");

    static async parse(schema, path) {
        return ValidationResult.success("html stuff", path);
    }

    static async validate(schema, path) {
        return ValidationResult.success("success", path);
    }

    static async create(schema, path, data) {
        const schemaItem = createLayoutDataStructure(data);
        return super.create(schema, path, schemaItem);
    }

    static async update(schema, path, schemaItem) {
        return ValidationResult.success("success", path);
    }

    static async delete(schema, path) {
        return ValidationResult.success("success", path);
    }
}

function createLayoutDataStructure(data) {
    const schemaItem = {
        "element"       : "layout",
        "id"            : data.id,
        "columnCount"   : data.columns.length,
        "rowCount"      : data.rows.length,
        "widths"        : data.columns,
        "heights"       : data.rows,
        "elements"      : []
    }

    const columnCount = data.columns.length;
    const rowCount = data.rows.length;

    for (let i = 0; i < columnCount * rowCount; i++) {
        schemaItem.elements.push({
            "element": "div",
            "id": crypto.randomUUID()
        });
    }

    return schemaItem;
}