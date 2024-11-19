import { ValidationResult } from "./../validation-result.js";
import { BaseProvider } from "./base-provider.js";
import {ParseContext} from "../enums/parse-context.js";
import { validate } from "../validation.js";

const TEMPLATE = `
<group-box data-title="__title__">__content__</group-box>
`

const DESIGN_TEMPLATE = `
<group-box-widget tabindex="0" data-widget-id="groupbox">
    <div class="group-box-header">
        <svg data-widget-action="toggle" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"></path></svg>
        <span contenteditable="true">__title__</span>
    </div>    
    <div class="group-box-body" data-droptarget="true">__content__</div>
</group-box-widget>
`

export class GroupBoxProvider extends BaseProvider {
    static key = Object.freeze("group-box");

    static async parse(schemaItem, path, context = ParseContext.DESIGNER) {
        const validationResult = await this.validate(schemaItem, path);

        if (ValidationResult.isError(validationResult)) {
            return validationResult;
        }

        let template = context === ParseContext.DESIGNER ? DESIGN_TEMPLATE : TEMPLATE;
        template = template.replace("__title__", schemaItem.title);

        return super.parse(template.trim(), schemaItem, path);
    }

    static async validate(schemaItem, path) {
        return validate(schemaItem, {
            title: { type: "string", critical: true },
        }, path);
    }

    static async create(schema, path, schemaItem) {
        schemaItem.elements ||= [];

        const validationResult = await this.validate(schemaItem, path);

        if (ValidationResult.isError(validationResult)) {
            return validationResult;
        }

        super.create(schema, path, schemaItem);
        return ValidationResult.success("success", path);
    }

    static async update(schema, path, schemaItem) {
        return super.update(schema, path, schemaItem, this.validate);
    }

    static async delete(schema, path) {
        return super.delete(schema, path);
    }
}