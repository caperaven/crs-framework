import {ValidationResult} from "../validation-result.js";
import {schemaItemAt} from "../path-finder.js";

/**
 * @class BaseProvider
 * @description This class is the base class for all providers.
 * It contains the basic methods for parsing, validating, creating, updating and deleting elements in the schema.
 * All providers should extend this class if they want to implement the methods.
 * The base provider does not do validation on CRUD operations as it is up to the provider to implement it.
 */
export class BaseProvider {
    /**
     * @method parse
     * @description This method is responsible for parsing the schema and generating HTML code.
     * @param template {String} The template to use for generating the HTML code.
     * @param schemaItem {Object} The schema JSON object.
     * @param path {String} The path of the schema part
     * @returns {String} The HTML code generated from the schema.
     */
    static async parse(template, schemaItem, path) {
        let result = structuredClone(template);

        for (const key of Object.keys(schemaItem)) {
            const stringTag = `__${key}__`;
            const value = schemaItem[key];
            result = result.replaceAll(stringTag, value);
        }

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
     * @param schemaItem {Object} The element to create
     * @param propertyName {String} The name of the property in the schema to add the element to add the schema item too.
     * @returns {ValidationResult} True if the schema is valid, false otherwise.
     */
    static async create(schema, path, schemaItem, propertyName = "elements") {
        const parent = schemaItemAt(schema, path);
        parent[propertyName] ||= [];
        parent.elements.push(schemaItem);
    }

    /**
     * @method update
     * @description This method is responsible for updating an existing element in the schema for a given path.
     * @param schema {Object} The schema
     * @param path {String} The path of the schema part
     * @param schemaItem {Object} The element to update
     * @param validateCallback
     * @returns {ValidationResult} True if the schema is valid, false otherwise.
     */
    static async update(schema, path, schemaItem, validateCallback) {
        const obj = schemaItemAt(schema, path);

        if (obj == null) {
            return ValidationResult.error("Element not found", path);
        }

        // First make changes to a copy of the object
        // Only if the changes validate successfully, apply them to the original object
        const copy = structuredClone(obj);
        Object.assign(copy, schemaItem);

        if (validateCallback != null) {
            const validationResult = await validateCallback(copy, path);

            if (ValidationResult.isError(validationResult)) {
                return validationResult;
            }
        }

        Object.assign(obj, schemaItem);
        return ValidationResult.success("success", path);
    }

    /**
     * @method delete
     * @description This method is responsible for deleting an existing element in the schema for a given path.
     * It also checks for dependencies and removes them if necessary
     * @param schema {Object} The schema
     * @param path {String} The path of the schema part
     * @param propertyName {String} The name of the property in the schema to add the element to add the schema
     * @returns {ValidationResult} True if the schema is valid, false otherwise.
     */
    static async delete(schema, path, propertyName = "elements") {
        const object = schemaItemAt(schema, path);

        if (object == null) {
            return ValidationResult.error("Element not found", path);
        }

        const parentPath = path.substring(0, path.lastIndexOf("/"));
        const parent = schemaItemAt(schema, parentPath);

        const index = parent[propertyName].indexOf(object);
        parent[propertyName].splice(index, 1);

        return ValidationResult.success("success", path);
    }
}
