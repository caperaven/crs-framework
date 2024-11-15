import { ValidationResult } from './validation-result.js';
import { RawProvider } from "./providers/raw.js";
import { schemaItemAt } from "./path-finder.js";

/**
 * @class SchemaManager
 * @description This class is responsible for generating HTML code from the schema.
 * The schema is a JSON object that represents the structure of the HTML code.
 * Different providers are registered with the HTMLGenerator to generate HTML code for different elements.
 * These providers also manage operations such as generating HTML, validating the schema part and making changes to the existing schema.
 */
export class SchemaManager {
    #providers = {};
    #id;
    #schemaActionsHandler = this.#schemaActions.bind(this);

    constructor(id) {
        this.#id = id;
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
        if (schemaItem.attributes == null) {
            return template.replace("__attributes__", "");
        }

        const attributes = [];
        for (const attribute of Object.keys(schemaItem.attributes)) {
            const attrValue = schemaItem.attributes[attribute];
            const attrString = `${attribute}="${attrValue}"`;
            attributes.push(attrString);
        }

        return template.replace("__attributes__", attributes.join(" "));
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
            template = template.replace("__classes__", "");
        }
        else {
            const classes = `class="${schemaItem.styles.join(" ")}"`;
            template =  template.replace("__classes__", classes);
        }

        if (schemaItem.styleProperties == null) {
            template = template.replace("__styles__", "");
        }
        else {
            const styles = [];

            for (const style of Object.keys(schemaItem.styleProperties)) {
                const styleValue = schemaItem.styleProperties[style];
                const styleString = `${style}:${styleValue};`;
                styles.push(styleString);
            }

            template = template.replace("__styles__", `style="${styles.join(" ")}"`);
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
        if (schemaItem.content != null) {
            return template.replace("__content__", schemaItem.content);
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
            return template.replace("__content__", "");
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
        return template.replace("__content__", childContent).trim();
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
     * @param schemaJson {Object} The schema JSON object.
     * @returns {ValidationResult} The HTML code generated from the schema.
     */
    async parse(schemaJson) {
        const body = schemaJson.body;
        const html = [];

        let index = 0;
        for (const element of body.elements) {
            const itemResult = await this.parseItem(element, `/[${index}]`);

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
    async parseItem(schemaItem, path) {
        const providerKey = schemaItem.element;
        const provider = this.#providers[providerKey] ?? this.#providers["raw"];

        const result = await provider.parse(schemaItem, path);

        if (ValidationResult.isError(result)) {
            return result;
        }

        let template = structuredClone(result.message);

        template = await this.#parseAttributes(template, schemaItem);
        template = await this.#parseStyles(template, schemaItem);
        template = await this.#parseContent(template, schemaItem);

        return ValidationResult.success(template.trim(), path);
    }

    /**
     * @method validate
     * @description This method is responsible for validating the schema.
     * By default, it will validate the entire schema.
     * If you define the path it will validate only that part of the schema.
     * @param schemaJson {Object} The schema JSON object.
     * @param path {String} The path of the schema part to validate.
     * @returns {ValidationResult} True if the schema is valid, false otherwise.
     */
    validate(schemaJson, path = null) {
        return ValidationResult.success("success");
    }

    /**
     * @method create
     * @description This method is responsible for creating a new element in the schema for a given path.
     * @param schemaJson {Object} The schema JSON object.
     * @param path {String} The path of the schema part
     * @param schemaItem {Object} The schemaItem to add to the schema.
     * @returns {ValidationResult} True if the schema is valid, false otherwise.
     */
    create(schemaJson, path, schemaItem) {
        const provider = this.#providers[schemaItem.element];
        return provider.create(schemaJson, path, schemaItem);
    }

    /**
     * @method update
     * @description This method is responsible for updating an existing element in the schema for a given path.
     * @param schemaJson {Object} The schema JSON object.
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
    update(schemaJson, path, assignment) {
        const provider = this.#providers[assignment.element];
        return provider.update(schemaJson, path, assignment);
    }

    /**
     * @method delete
     * @description This method is responsible for deleting an existing element in the schema for a given path.
     * @param schemaJson {Object} The schema JSON object.
     * @param path {String} The path of the schema part
     * @returns {ValidationResult} True if the schema is valid, false otherwise.
     */
    delete(schemaJson, path) {
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
     * @param schemaJson {Object} The schema JSON object.
     * @param path {String} The path of the schema part
     * @param attributeName {String} The name of the attribute
     * @param attributeValue {String} The value of the attribute
     * @returns {{type: string, message}}
     */
    setAttribute(schemaJson, path, attributeName, attributeValue) {
        const schemaItem = schemaItemAt(schemaJson, path);

        if (schemaItem == null) {
            return ValidationResult.error(`The path ${path} does not exist in the schema.`);
        }

        schemaItem.attributes ||= {};
        schemaItem.attributes[attributeName] = attributeValue;

        return ValidationResult.success("success");
    }

    deleteAttribute(schemaJson, path, attributeName) {
        const schemaItem = schemaItemAt(schemaJson, path);

        if (schemaItem == null) {
            return ValidationResult.error(`The path ${path} does not exist in the schema.`);
        }

        if (schemaItem.attributes != null) {
            delete schemaItem.attributes[attributeName];
        }

        return ValidationResult.success("success");
    }

    addStyle(schemaJson, path, className) {
        const schemaItem = schemaItemAt(schemaJson, path);

        if (schemaItem == null) {
            return ValidationResult.error(`The path ${path} does not exist in the schema.`);
        }

        schemaItem.styles ||= [];
        schemaItem.styles.push(className);

        return ValidationResult.success("success");
    }

    deleteStyle(schemaJson, path, className) {
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

    setStyleProperty(schemaJson, path, propertyName, propertyValue) {
        const schemaItem = schemaItemAt(schemaJson, path);

        if (schemaItem == null) {
            return ValidationResult.error(`The path ${path} does not exist in the schema.`);
        }

        schemaItem.styleProperties ||= {};
        schemaItem.styleProperties[propertyName] = propertyValue;

        return ValidationResult.success("success");
    }

    deleteStyleProperty(schemaJson, path, propertyName) {
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