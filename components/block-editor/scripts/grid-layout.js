import { add } from "./utils/positions.js";
import { CssGridModule } from "./utils/css-grid.js";

export async function createInstance(targetElement, args, position, widgetId) {
    const data = await CssGridModule.create(args);
    const element = document.createElement("div");
    element.dataset.widgetId = widgetId;
    element.setAttribute("tabindex", "0");

    await CssGridModule.apply({ data, element });

    add(element, targetElement, position);
}