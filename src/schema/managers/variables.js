import { ValidationResult } from "./../validation-result.js";

/**
 * {
 *     "variables": {
 *          "person": { "firstName": "John" }
 *     },
 *
 *     "body": {
 *         "elements": [
 *             {
 *                  "element": "input",
 *                  "title": "@person.firstName"
 *             }
 *         ]
 *     }
 * }
 */
export class VariablesManager {
    static key = Object.freeze("variables");

    #onEventHandler = this.#onEvent.bind(this);

    constructor() {
        crsbinding.events.emitter.on("variables-actions", this.#onEventHandler);
    }

    dispose() {
        crsbinding.events.emitter.remove("variables-actions", this.#onEventHandler);
        this.#onEventHandler = null;
    }

    async #onEvent(event) {
        const translation = await crsbinding.events.emitter.emit("variables", {
            "schemaId": "my_schema",
            "action": "get",
            "args": [schemaId, "@person.firstName"]
        })
    }

    /**
     * @method create
     * @description create a variable from the "variables" root object
     * @param schemaId {string} - schema id to update
     * @param path {string} - schema path syntax assuming variables is the root object
     * @param value {any} - value to set
     * @returns {Promise<{type: string}>}
     *
     * @example
     * VariablesManager.create(schema, "person/firstName", "John");
     * Will result in
     *
     * {
     *     "variables": {
     *         "person": { "firstName": "John" }
     *     }
     * }
     */
    async create(schemaId, path, value) {
        return ValidationResult.success("success", path);
    }

    async update(schema, path, value) {
        return ValidationResult.success("success", path);
    }

    /**
     * @method get
     * @description get a variable from the "variables" root object
     * @param schema {Object} - schema to update
     * @param path {string} - schema path syntax assuming variables is the root object
     * @returns {Promise<void>}
     */
    async get(schema, path) {
        return ValidationResult.success("success", path);
    }

    /**
     * @method delete
     * @description delete a variable from the "variables" root object
     * @param schema {Object} - schema to update
     * @param path {string} - schema path syntax assuming variables is the root object
     * @returns {Promise<void>}
     */
    async delete(schema, path) {
        // 1. how many items are using this variable?
        // 2. if more than one item is using the variable, then we can't delete it

        return ValidationResult.success("success", path);
    }

    /**
     * @method clean
     * @description remove all variables from the "variables" dictionary if it is not used in the schema.
     * @param schema
     * @returns {Promise<void>}
     */
    async clean(schema) {

    }
}

