import { ValidationResult } from "./../validation-result.js";

const TEMPLATE = `
    <__tag__ __attributes__ __styles__ __classes__ __styles__>__content__</__tag__>
`

export class RawProvider {
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
        return ValidationResult.success(result, path);
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
     * @param schemaItem {Object} The schema
     * @param path {String} The path of the schema part
     * @param element {Object} The element to create
     * @returns {ValidationResult} True if the schema is valid, false otherwise.
     */
    static async create(schemaItem, path, element) {
        // 1. create the element in the schema
        // 2. validate the schema item

        return ValidationResult.success("success", path);
    }

    /**
     * @method update
     * @description This method is responsible for updating an existing element in the schema for a given path.
     * @param schemaItem {Object} The schema
     * @param path {String} The path of the schema part
     * @param element {Object} The element to update
     * @returns {ValidationResult} True if the schema is valid, false otherwise.
     */
    static async update(schemaItem, path, element) {
        // 1. update the element in the schema
        // 2. validate the schema item
        // 3. validate affected managers also e.g. if you add a grid column, make sure the datasource has the same column

        return ValidationResult.success("success", path);
    }

    /**
     * @method delete
     * @description This method is responsible for deleting an existing element in the schema for a given path.
     * It also checks for dependencies and removes them if necessary
     * @param schemaItem {Object} The schema
     * @param path {String} The path of the schema part
     * @returns {ValidationResult} True if the schema is valid, false otherwise.
     */
    static async delete(schemaItem, path) {
        // 1. can I clean this up?
        // 2. if not, return an error
        // 3. if yes, remove the element from the schema and do clean up
        // 4. validate affected manager changes

        return ValidationResult.success("success", path);
    }

}