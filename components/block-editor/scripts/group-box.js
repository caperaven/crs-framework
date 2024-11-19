import { add } from "./utils/positions.js";
import {ValidationResult} from "../../../src/schema/validation-result.js";

const template = `
<group-box-widget tabindex="0">
    <div class="group-box-header">
        <svg data-widget-action="toggle" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>
        <span contenteditable="true">Group Box</span>
    </div>    
    <div class="group-box-body" data-droptarget="true"></div>
</group-box-widget>
`;

export async function createInstance(targetElement, args, position, widgetId, schemaId) {
    const templateElement = document.createElement("template");
    templateElement.innerHTML = template;
    const instance = templateElement.content.cloneNode(true);
    instance.firstElementChild.dataset.widgetId = widgetId;

    // Append the instance to the target element
    const path = add(instance.firstElementChild, targetElement, position);
    const pathParts = path.split("/");
    const id = pathParts.pop().slice(1);
    const parentPath = pathParts.join("/");

    let result = await crsbinding.events.emitter.emit("schema-actions", {
        action: "create",
        args: [schemaId, parentPath, {
            "element": "group-box",
            "id": id,
            "widgetId": widgetId,
            "title": "Group Box",
            "elements": []
        }]
    })

    if (ValidationResult.isError(result)) {
        alert(result.message);
    }
}

export async function toggle(widgetElement, targetElement, widget, event) {
    const isExpanded = (widgetElement.getAttribute("aria-expanded") ?? "true") === "true";
    widgetElement.setAttribute("aria-expanded", !isExpanded);
}