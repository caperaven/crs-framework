import { ValidationResult } from "../validation-result.js";
import { BaseProvider } from "./base-provider.js";
import { ParseContext } from "./../enums/parse-context.js";

const TEMPLATE = `
<div data-widget-id="__widgetId__" id="__id__" __style__>__content__</div>
`

export class LayoutProvider extends BaseProvider {
    static key = Object.freeze("layout");

    static async parse(schema, path, context = ParseContext.DESIGNER) {
        const {id, widths, heights, elements, widgetId} = schema;
        const styles = `style="display: grid; grid-template-columns: ${widths.join(" ")}; grid-template-rows: ${heights.join(" ")}; width="100%"; height="100%";"`;

        let result = structuredClone(TEMPLATE);
        result = result.replace(/__widgetId__/g, widgetId);
        result = result.replace(/__id__/g, id);
        result = result.replace(/__style__/, styles);

        const html = [];

        for (let i = 0; i < elements.length; i++) {
            const result = await this.parser.parseItem(elements[i], `${path}/elements/${i}`, context);

            if (ValidationResult.isError(result)) {
                return result;
            }

            html.push(result.message);
        }

        result = result.replace(/__content__/, html.join(""));

        return ValidationResult.success(result.trim(), path);
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