import { ValidationResult } from './validation-result.js';
import { RawProvider } from "./providers/raw.js";
import { schemaItemAt } from "./path-finder.js";
import { ParseContext } from "./enums/parse-context.js";

const ATTRIBUTES_MARKER = "__attributes__";
const CLASSES_MARKER    = "__classes__";
const STYLES_MARKER     = "__styles__";
const CONTENT_MARKER    = "__content__";

/**
 * @class SchemaManager
 * @description This class is responsible for generating HTML code from the schema.
 * The schema is a JSON object that represents the structure of the HTML code.
 * Different providers are registered with the HTMLGenerator to generate HTML code for different elements.
 * These providers also manage operations such as generating HTML, validating the schema part and making changes to the existing schema.
 */
export class SchemaManager {
    #providers = {};
    #schemaActionsHandler = this.#schemaActions.bind(this);
    #schemas = {};

    constructor() {
        this.registerProvider(RawProvider);

        crsbinding.events.emitter.on("schema-actions", this.#schemaActionsHandler).catch(error => console.error(error));
    }

    dispose() {
        crsbinding.events.emitter.remove("schema-actions", this.#schemaActionsHandler).catch(error => console.error(error));

        for (const providerKey of Object.keys(this.#providers)) {
            const provider = this.#providers[providerKey];
            provider.parser = null;
            this.#providers[providerKey] = null;
        }

        this.#providers = null;
    }

    #schemaActions(event) {
        if (this[event.action] != null) {
            return this[event.action](...event.args ?? []);
        }
    }

    /**
     * @method #parseAttributes
     * @description This method is responsible for parsing the attributes of the schema item.
     * The template string is used to replace the __attributes__ placeholder with the attributes.
     * @param template {String} The template string.
     * @param schemaItem {Object} The schema item.
     * @returns {Promise<*>}
     */
    async #parseAttributes(template, schemaItem) {
        if (schemaItem.attributes == null || template.indexOf(ATTRIBUTES_MARKER) === -1) {
            return template.replace(ATTRIBUTES_MARKER, "");
        }

        const attributes = [];
        for (const attribute of Object.keys(schemaItem.attributes)) {
            const attrValue = schemaItem.attributes[attribute];
            const attrString = `${attribute}="${attrValue}"`;
            attributes.push(attrString);
        }

        return template.replace(ATTRIBUTES_MARKER, attributes.join(" "));
    }

    /**
     * @method #parseStyles
     * @description This method is responsible for parsing the styles of the schema item.
     * @param template {String} The template string.
     * @param schemaItem {Object} The schema item.
     * @returns {Promise<*>}
     */
    async #parseStyles(template, schemaItem) {
        if (schemaItem.styles == null) {
            template = template.replace(CLASSES_MARKER, "");
        }
        else {
            const classes = `class="${schemaItem.styles.join(" ")}"`;
            template =  template.replace(CLASSES_MARKER, classes);
        }

        if (schemaItem.styleProperties == null) {
            template = template.replace(STYLES_MARKER, "");
        }
        else {
            const styles = [];

            for (const style of Object.keys(schemaItem.styleProperties)) {
                const styleValue = schemaItem.styleProperties[style];
                const styleString = `${style}:${styleValue};`;
                styles.push(styleString);
            }

            template = template.replace(STYLES_MARKER, `style="${styles.join(" ")}"`);
        }

        return template;
    }

    /**
     * @method #parseContent
     * @description This method is responsible for parsing the content of the schema item.
     * If the schema item has content, it will replace the __content__ placeholder with the content.
     * If the schema item has child elements, it will parse the children and replace the __content__ placeholder with the children.
     * @param template
     * @param schemaItem
     * @returns {Promise<*|{type: string}>}
     */
    async #parseContent(template, schemaItem) {
        if (template.indexOf(CONTENT_MARKER) === -1) template;

        if (schemaItem.content != null) {
            return template.replace(CONTENT_MARKER, schemaItem.content);
        }

        return await this.#parseChildren(template, schemaItem);
    }

    /**
     * @method #parseChildren
     * @description This method is responsible for parsing the children of the schema item.
     * @param template {String} The template string.
     * @param schemaItem {Object} The schema item.
     * @returns {Promise<*|{type: string}|string>}
     */
    async #parseChildren(template, schemaItem) {
        if (schemaItem.elements == null) {
            return template.replace(CONTENT_MARKER, "");
        }

        const children = [];

        for (const child of schemaItem.elements) {
            const childResult = await this.parseItem(child);

            if (ValidationResult.isError(childResult)) {
                return childResult;
            }

            children.push(childResult.message);
        }

        const childContent = children.join(" ").trim();
        return template.replace(CONTENT_MARKER, childContent).trim();
    }

    registerSchema(schemaId, schema) {
        this.#schemas[schemaId] = schema;
    }

    unregisterSchema(schemaId) {
        delete this.#schemas[schemaId];
    }

    /**
     * @method registerProvider
     * @description This method is responsible for registering a provider with the HTMLGenerator.
     * @param provider
     */
    registerProvider(provider) {
        this.#providers[provider.key] = provider;
        provider.parser = this;
    }

    /**
     * @method parse
     * @description This method is responsible for parsing the schema and generating HTML code.
     * @param schemaId {Object} The schema JSON object.
     * @returns {ValidationResult} The HTML code generated from the schema.
     */
    async parse(schemaId, context = ParseContext.DESIGNER) {
        const schemaJson = this.#schemas[schemaId];

        const body = schemaJson.body;
        const html = [];

        let index = 0;
        for (const element of body.elements) {
            const itemResult = await this.parseItem(element, `/[${index}]`, context);

            if (ValidationResult.isError(itemResult)) {
                return itemResult;
            }

            html.push(itemResult.message);
        }

        const result = html.join("").replace(/\s+>/g, '>');
        return ValidationResult.success(result, "/");
    }

    /**
     * @method parseItem
     * @description This method is responsible for parsing the schema item and generating HTML code.
     * @param schemaItem
     * @param path
     * @returns {Promise<{type: string}|*>}
     */
    async parseItem(schemaItem, path, context = ParseContext.DESIGNER) {
        const providerKey = schemaItem.element;
        const provider = this.#providers[providerKey] ?? this.#providers["raw"];

        const result = await provider.parse(schemaItem, path, context);

        if (ValidationResult.isError(result)) {
            return result;
        }

        let template = structuredClone(result.message);

        template = await this.#parseAttributes(template, schemaItem);
        template = await this.#parseStyles(template, schemaItem);
        template = await this.#parseContent(template, schemaItem);

        // remove any double spaces from the template string before passing it on
        template = template.replace(/\s+/g, " ");

        // replace all " >" with ">"
        template = template.replace(/\s+>/g, '>');

        return ValidationResult.success(template.trim(), path);
    }

    get(schemaId) {
        return this.#schemas[schemaId];
    }

    /**
     * @method validate
     * @description This method is responsible for validating the schema.
     * By default, it will validate the entire schema.
     * If you define the path it will validate only that part of the schema.
     * @param schemaId {Object} The schema id.
     * @param path {String} The path of the schema part to validate.
     * @returns {ValidationResult} True if the schema is valid, false otherwise.
     */
    validate(schemaId, path = null) {
        return ValidationResult.success("success");
    }

    /**
     * @method create
     * @description This method is responsible for creating a new element in the schema for a given path.
     * @param schemaId {Object} The schema id.
     * @param path {String} The path of the schema part
     * @param schemaItem {Object} The schemaItem to add to the schema.
     * @returns {ValidationResult} True if the schema is valid, false otherwise.
     */
    create(schemaId, path, schemaItem) {
        const provider = this.#providers[schemaItem.element] ?? this.#providers["raw"];
        const schemaJson = this.#schemas[schemaId];
        return provider.create(schemaJson, path, schemaItem);
    }

    /**
     * @method update
     * @description This method is responsible for updating an existing element in the schema for a given path.
     * @param schemaId {Object} The schema id.
     * @param path {String} The path of the schema part
     * @param assignment {Object} The element to update.
     * @returns {ValidationResult} True if the schema is valid, false otherwise.
     *
     * @example
     * // Example of updating an existing element in the schema.
     * const schema = {
     *     "body": {
     *         "elements": [
     *             {
     *                 "id"     : "edtFirstName",
     *                 "element : "input",
     *                 "field"  : "firstName",
     *                 "title"  : "First Name",
     *             }
     *         ]
     *     }
     * }
     *
     * const schemaManager = new SchemaManager();
     * const result = schemaManager.update(schema, "/edtFirstName", { "title": "First Name Updated" });
     */
    update(schemaId, path, assignment) {
        const provider = this.#providers[assignment.element];
        const schemaJson = this.#schemas[schemaId];
        return provider.update(schemaJson, path, assignment);
    }

    /**
     * @method delete
     * @description This method is responsible for deleting an existing element in the schema for a given path.
     * @param schemaId {Object} The schema id.
     * @param path {String} The path of the schema part
     * @returns {ValidationResult} True if the schema is valid, false otherwise.
     */
    delete(schemaId, path) {
        const schemaJson = this.#schemas[schemaId];
        const schemaItem = schemaItemAt(schemaJson, path);

        if (schemaItem == null) {
            return ValidationResult.error(`The path ${path} does not exist in the schema.`);
        }

        const provider = this.#providers[schemaItem.element];
        return provider.delete(schemaJson, path);
    }

    /**
     * @method setAttribute
     * @description This method is responsible for setting an attribute in the schema.
     * If the attribute exists it will be updated but if it does not exist it will be created.
     * @param schemaId {Object} The schema id.
     * @param path {String} The path of the schema part
     * @param attributeName {String} The name of the attribute
     * @param attributeValue {String} The value of the attribute
     * @returns {{type: string, message}}
     */
    setAttribute(schemaId, path, attributeName, attributeValue) {
        const schemaJson = this.#schemas[schemaId];
        const schemaItem = schemaItemAt(schemaJson, path);

        if (schemaItem == null) {
            return ValidationResult.error(`The path ${path} does not exist in the schema.`);
        }

        schemaItem.attributes ||= {};
        schemaItem.attributes[attributeName] = attributeValue;

        return ValidationResult.success("success");
    }

    deleteAttribute(schemaId, path, attributeName) {
        const schemaJson = this.#schemas[schemaId];
        const schemaItem = schemaItemAt(schemaJson, path);

        if (schemaItem == null) {
            return ValidationResult.error(`The path ${path} does not exist in the schema.`);
        }

        if (schemaItem.attributes != null) {
            delete schemaItem.attributes[attributeName];
        }

        return ValidationResult.success("success");
    }

    addStyle(schemaId, path, className) {
        const schemaJson = this.#schemas[schemaId];
        const schemaItem = schemaItemAt(schemaJson, path);

        if (schemaItem == null) {
            return ValidationResult.error(`The path ${path} does not exist in the schema.`);
        }

        schemaItem.styles ||= [];
        schemaItem.styles.push(className);

        return ValidationResult.success("success");
    }

    deleteStyle(schemaId, path, className) {
        const schemaJson = this.#schemas[schemaId];
        const schemaItem = schemaItemAt(schemaJson, path);

        if (schemaItem == null) {
            return ValidationResult.error(`The path ${path} does not exist in the schema.`);
        }

        if (schemaItem.styles != null) {
            const index = schemaItem.styles.indexOf(className);

            if (index > -1) {
                schemaItem.styles.splice(index, 1);
            }
        }

        return ValidationResult.success("success");
    }

    setStyleProperty(schemaId, path, propertyName, propertyValue) {
        const schemaJson = this.#schemas[schemaId];
        const schemaItem = schemaItemAt(schemaJson, path);

        if (schemaItem == null) {
            return ValidationResult.error(`The path ${path} does not exist in the schema.`);
        }

        schemaItem.styleProperties ||= {};
        schemaItem.styleProperties[propertyName] = propertyValue;

        return ValidationResult.success("success");
    }

    deleteStyleProperty(schemaId, path, propertyName) {
        const schemaJson = this.#schemas[schemaId];
        const schemaItem = schemaItemAt(schemaJson, path);

        if (schemaItem == null) {
            return ValidationResult.error(`The path ${path} does not exist in the schema.`);
        }

        if (schemaItem.styleProperties != null) {
            delete schemaItem.styleProperties[propertyName];
        }

        return ValidationResult.success("success");
    }
}