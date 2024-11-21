import { add } from "./utils/positions.js";

export async function createInstance(targetElement, args, position, widgetId, schemaId) {
    const element = document.createElement(args.tagName);
    element.dataset.widgetId = widgetId;
    element.textContent = args.text;
    element.contentEditable = true;

    add(element, targetElement, position);
}

export async function updateContent(targetElement, value) {

}