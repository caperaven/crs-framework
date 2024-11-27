import { ValidationResult } from "./../validation-result.js";
import {BaseProvider} from "./base-provider.js";

const TEMPLATE = `
    <__tag__ __attributes__ __classes__ __styles__>__content__</__tag__>
`

export class RawProvider extends BaseProvider {
    static key = Object.freeze("raw");

    /**
     * @method parse
     * @description This method is responsible for parsing the schema and generating HTML code.
     * @param schemaItem {Object} The schema JSON object.
     * @param path {String} The path of the schema part
     * @returns {String} The HTML code generated from the schema.
     */
    static async parse(schemaItem, path) {
        const result = TEMPLATE.replaceAll("__tag__", schemaItem.element);
        return ValidationResult.success(result.trim(), path);
    }

    /**
     * @method validate
     * @description This method is responsible for validating the schema.
     * @param schemaItem {Object} The schema JSON object.
     * @param path {String} The path of the schema part
     * @returns {ValidationResult} True if the schema is valid, false otherwise.
     */
    static async validate(schemaItem, path) {
        return ValidationResult.success("success", path);
    }

    /**
     * @method create
     * @description This method is responsible for creating a new element in the schema for a given path.
     * @param schema {Object} The schema
     * @param path {String} The path of the schema part
     * @param data {Object} The element to create
     * @returns {ValidationResult} True if the schema is valid, false otherwise.
     */
    static async create(schema, path, data) {
        return super.create(schema, path, data);
    }

    /**
     * @method update
     * @description This method is responsible for updating an existing element in the schema for a given path.
     * @param schema {Object} The schema
     * @param path {String} The path of the schema part
     * @param data {Object} The element to update
     * @returns {ValidationResult} True if the schema is valid, false otherwise.
     */
    static async update(schema, path, data) {
        return super.update(schema, path, data);
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