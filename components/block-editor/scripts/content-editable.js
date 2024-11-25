import { add } from "./utils/positions.js";
import { getPathParts } from "./utils/get-path.js";

export async function createInstance(targetElement, args, position, widgetId, schemaId) {
    const element = document.createElement(args.tagName);
    element.dataset.widgetId = widgetId;
    element.textContent = args.text;
    element.contentEditable = true;

    const path = add(element, targetElement, position);
    await addToSchema(path, schemaId, widgetId, args.tagName, args.text);
}

export async function addToSchema(path, schemaId, widgetId, tagName, content) {
    const {id, parentPath} = getPathParts(path);

    const data = {
        element: tagName.toLowerCase(),
        content: content,
        id: id,
        widgetId: widgetId
    }

    await crsbinding.events.emitter.emit("schema-actions", {
        action: "create",
        args: [schemaId, parentPath, data]
    })

}