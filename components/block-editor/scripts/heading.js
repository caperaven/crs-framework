import { add } from "./utils/positions.js";

export async function createInstance(targetElement, args, position, widgetId) {
    const tagName = `h${args.level}`;

    const element = document.createElement(tagName);
    element.dataset.widgetId = widgetId;
    element.textContent = `Heading ${args.level}`;
    element.contentEditable = true;

    add(element, targetElement, position);
}