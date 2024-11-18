import { ValidationResult } from "../validation-result.js";
import { BaseProvider } from "./base-provider.js";
import { ParseContext } from "./../enums/parse-context.js";

const TEMPLATE = `
<div data-widget-id="__widgetId__" id="__id__" __style__>__content__</div>
`

export class LayoutProvider extends BaseProvider {
    static key = Object.freeze("layout");

    static async parse(schema, path, context = ParseContext.DESIGNER) {
        const {id, columns, rows, elements, widgetId} = schema;
        const styles = `style="display: grid; grid-template-columns: ${columns.join(" ")}; grid-template-rows: ${rows.join(" ")}; width: 100%; height: 100%;"`;

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
    for (let i = 0; i < data.elements; i++) {
        const element = data.elements[i];

        element.styles = {
            width: "100%",
            height: "100%"
        }

        element.attributes = {
            "data-droptarget": true
        }
    }

    return data;
}