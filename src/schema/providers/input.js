import { ValidationResult } from "./../validation-result.js";
import { BaseProvider } from "./base-provider.js";
import { validate } from "../validation.js";

const TEMPLATE = `
<label data-field="__field__">
    <div>__title__</div>
    <input type="__type__" placeholder="__placeholder__"/>
</label>
`

export class InputProvider extends BaseProvider {
    static key = Object.freeze("input");

    /**
     * @method parse
     * @description This method is responsible for parsing the schema and generating HTML code.
     * @param schemaItem {Object} The schema JSON object.
     * @param path {String} The path of the schema part
     * @returns {String} The HTML code generated from the schema.
     */
    static async parse(schemaItem, path) {
        schemaItem.type ||= "text";
        return super.parse(TEMPLATE.trim(), schemaItem, path);
    }

    /**
     * @method validate
     * @description This method is responsible for validating the schema.
     * @param schemaItem {Object} The schema JSON object.
     * @param path {String} The path of the schema part
     * @returns {ValidationResult} True if the schema is valid, false otherwise.
     */
    static async validate(schemaItem, path) {
        return validate(schemaItem, {
            field: { type: "string", critical: true },
            title: { type: "string", critical: true },
            placeholder: { type: "string" }
        }, path);
    }

    /**
     * @method create
     * @description This method is responsible for creating a new element in the schema for a given path.
     * @param schema {Object} The schema
     * @param path {String} The path of the schema part
     * @param schemaItem {Object} The json object to create on the schema at the given path
     * @returns {ValidationResult} True if the schema is valid, false otherwise.
     */
    static async create(schema, path, schemaItem) {
        schemaItem.element = this.key;
        const validationResult = await this.validate(schemaItem, path);

        if (ValidationResult.isError(validationResult)) {
            return validationResult;
        }

        super.create(schema, path, schemaItem);
        return ValidationResult.success("success", path);
    }

    /**
     * @method update
     * @description This method is responsible for updating an existing element in the schema for a given path.
     * @param schema {Object} The schema
     * @param path {String} The path of the schema part
     * @param schemaItem {Object} The json object to create on the schema at the given path     * @returns {ValidationResult} True if the schema is valid, false otherwise.
     * @returns {ValidationResult} True if the schema is valid, false otherwise.
     */
    static async update(schema, path, schemaItem) {
        return super.update(schema, path, schemaItem, this.validate);
    }

    /**
     * @method delete
     * @description This method is responsible for deleting an existing element in the schema for a given path.
     * It also checks for dependencies and removes them if necessary
     * @param schema {Object} The schema
     * @param path {String} The path of the schema part
     * @returns {ValidationResult} True if the schema is valid, false otherwise.
     */
    static async delete(schema, path) {
        return super.delete(schema, path);
    }
}