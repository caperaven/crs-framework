import {ValidationResult} from "../validation-result.js";

export class TemplatesManager {
    static key = Object.freeze("templates");

    async create(schemaId, path, value) {
        const schema = await getSchema(schemaId);
        schema.templates ||= {}
        schema.templates[path] = value;

        return ValidationResult.success("success", path);
    }

    async update(schemaId, path, value) {

    }

    async get(schemaId, path) {
        const schema = await getSchema(schemaId);
        const value = schema.templates[path];
        return ValidationResult.success(value, path);
    }

    async delete(schemaId, path) {
        const schema = await getSchema(schemaId);
        delete schema.templates[path];
    }

    async clean(schemaId) {
        const schema = await getSchema(schemaId);
        const schemaText = JSON.stringify(schema);
        clear(schema.templates, schemaText);
        return ValidationResult.success("success", schemaId);
    }

    async validate(schemaId) {
        return ValidationResult.success("success", schemaId);
    }
}

async function getSchema(schemaId) {
    return await crsbinding.events.emitter.emit("schema-actions", { action: "get", args: [schemaId] });
}

function clear(obj, schemaText) {
    for (const key of Object.keys(obj)) {
        const searchString1 = `template: ${key}`;
        const searchString2 = `template:${key}`;

        if (schemaText.indexOf(searchString1) === -1 && schemaText.indexOf(searchString2) === -1) {
            delete obj[key];
        }
    }
}