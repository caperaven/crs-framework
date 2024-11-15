import { add } from "./utils/positions.js";
import { CssGridModule } from "./utils/css-grid.js";

export async function createInstance(targetElement, args, position, widgetId) {
    const data = await CssGridModule.create(args);
    const element = document.createElement("div");
    element.dataset.widgetId = widgetId;
    element.setAttribute("tabindex", "0");

    await CssGridModule.apply({ data, element });
    const path = add(element, targetElement, position);
    await addToSchema(data, path);
}

async function addToSchema(data, path) {
    const schema = {
        "body": {
            "elements": []
        }
    }

    const pathParts = path.split("/");
    const id = pathParts.pop();
    const parentPath = pathParts.join("/");

    data.element = "layout";
    data.id = id.slice(1);

    await crsbinding.events.emitter.emit("schema-actions", {
        action: "create",
        args: [schema, parentPath, data]
    })

    console.log(schema);
}