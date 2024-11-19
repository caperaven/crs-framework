import { add } from "./utils/positions.js";
import { CssGridModule } from "./utils/css-grid.js";
import { getPathParts } from "./utils/get-path.js";

export async function createInstance(targetElement, args, position, widgetId, schemaId) {
    const data = await CssGridModule.create(args);
    const element = document.createElement("div");
    element.dataset.widgetId = widgetId;
    element.setAttribute("tabindex", "0");

    await CssGridModule.apply({ data, element });
    const path = add(element, targetElement, position);
    await addToSchema(data, path, schemaId, widgetId, element.children);
}

async function addToSchema(data, path, schemaId, widgetId, children) {
    const {id, parentPath} = getPathParts(path);

    data.element = "layout";
    data.id = id.slice(1);
    data.widgetId = widgetId;

    // JHR: Refactor this so that it is rather on the schema manager provider's create action
    data.elements = [];

    for (let i = 0; i < children.length; i ++) {
        const child = children[i];

        data.elements.push({
            "element": "div",
            "id": child.id,
            "attributes": {
                "data-droptarget": true
            }
        })
    }

    await crsbinding.events.emitter.emit("schema-actions", {
        action: "create",
        args: [schemaId, parentPath, data]
    })
}