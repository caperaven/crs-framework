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
        if (this[event.action] != null) {
            return this[event.action](...event.args ?? []);
        }
    }

    /**
     * @method create
     * @description create a variable from the "variables" root object
     * @param schemaId {string} - schema id to update
     * @param path {string} - schema path syntax assuming variables is the root object
     * @param value {any} - value to set
     * @returns {Promise<ValidationResult>}
     *
     * @example
     * VariablesManager.create(schema, "@person/firstName", "John");
     * Will result in
     *
     * {
     *     "variables": {
     *         "person": { "firstName": "John" }
     *     }
     * }
     */
    async create(schemaId, path, value)
    {
        const pathArray = pathToArray(path);
        const schema = await getSchema(schemaId);

        schema.variables ||= {};

        setValueOnPath(schema.variables, pathArray, value);

        return ValidationResult.success("success", path);
    }

    async update(schemaId, path, value) {
        return this.create(schemaId, path, value);
    }

    /**
     * @method get
     * @description get a variable from the "variables" root object
     * @param schemaId {string} - schema id to update
     * @param path {string} - schema path syntax assuming variables is the root object
     * @returns {Promise<ValidationResult>}
     */
    async get(schemaId, path) {
        const pathArray = pathToArray(path);
        const schema = await getSchema(schemaId);

        schema.variables ||= {};

        const value = getValueOnPath(schema.variables, pathArray);

        return ValidationResult.success(value, path);
    }

    /**
     * @method delete
     * @description delete a variable from the "variables" root object
     * @param schemaId {string} - schema id to update
     * @param path {string} - schema path syntax assuming variables is the root object
     * @returns {Promise<ValidationResult>}
     */
    async delete(schemaId, path) {
        const pathArray = pathToArray(path);
        const schema = await getSchema(schemaId);

        schema.variables ||= {};

        deleteValueOnPath(schema.variables, pathArray);

        return ValidationResult.success("success", path);
    }

    /**
     * @method clean
     * @description remove all variables from the "variables" dictionary if it is not used in the schema.
     * @param schemaId {string} - schema id to update
     * @returns {Promise<ValidationResult>}
     */
    async clean(schemaId) {
        return ValidationResult.success("success", schemaId);
    }


    async validate(schemaId) {
        return ValidationResult.success("success", schemaId);
    }
}

function pathToArray(path) {
    if (path.startsWith("@")) {
        path = path.slice(1);
    }

    if (path.indexOf("/") !== -1) {
        return path.split("/");
    }

    return path.split(".");
}

async function getSchema(schemaId) {
    return await crsbinding.events.emitter.emit("schema-actions", { action: "get", args: [schemaId] });
}

function getValueOnPath(obj, path) {
    for (let i = 0; i < path.length; i++) {
        const key = path[i];

        if (obj.hasOwnProperty(key) === false) {
            return null;
        }

        obj = obj[key];
    }

    return obj;
}

function setValueOnPath(obj, path, value) {
    const propertyName = path.pop();

    for (let i = 0; i < path.length; i++) {
        const key = path[i];
        obj[key] ||= {};
        obj = obj[key];
    }

    obj[propertyName] = value;
}

function deleteValueOnPath(obj, path) {
    const property = path.pop();
    let targetObj = obj;

    for (let i = 0; i < path.length; i++) {
        const key = path[i];
        targetObj = targetObj[key];
    }

    delete targetObj[property];

    // if the object is empty, remove the key
    if (Object.keys(targetObj).length === 0 && path.length > 0) {
        deleteValueOnPath(obj, path);
    }
}


