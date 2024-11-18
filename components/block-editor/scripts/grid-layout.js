import { add } from "./utils/positions.js";
import { CssGridModule } from "./utils/css-grid.js";

export async function createInstance(targetElement, args, position, widgetId, schemaId) {
    const data = await CssGridModule.create(args);
    const element = document.createElement("div");
    element.dataset.widgetId = widgetId;
    element.setAttribute("tabindex", "0");

    await CssGridModule.apply({ data, element });
    const path = add(element, targetElement, position);
    await addToSchema(data, path, schemaId, widgetId);
}

async function addToSchema(data, path, schemaId, widgetId) {
    const pathParts = path.split("/");
    const id = pathParts.pop();
    const parentPath = pathParts.join("/");

    data.element = "layout";
    data.id = id.slice(1);
    data.widgetId = widgetId;

    await crsbinding.events.emitter.emit("schema-actions", {
        action: "create",
        args: [schemaId, parentPath, data]
    })

    const schema = await crsbinding.events.emitter.emit("schema-actions", {
        action: "get",
        args: [schemaId]
    })

    console.log(schema)
}