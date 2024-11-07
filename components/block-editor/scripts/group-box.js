import { add } from "./utils/positions.js";

const template = `
<group-box-widget tabindex="0">
    <div class="group-box-header">
        <svg data-widget-action="toggle" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>
        <span contenteditable="true">Group Box</span>
    </div>    
    <div class="group-box-body" data-droptarget="true"></div>
</group-box-widget>
`;

export async function createInstance(targetElement, args, position, widgetId) {
    const templateElement = document.createElement("template");
    templateElement.innerHTML = template;
    const instance = templateElement.content.cloneNode(true);

    // Set the widgetId if needed
    instance.querySelector('group-box-widget').dataset.widgetId = widgetId;

    // Append the instance to the target element
    add(instance, targetElement, position);
}

export async function toggle(widgetElement, targetElement, widget, event) {
    const isExpanded = (widgetElement.getAttribute("aria-expanded") ?? "true") === "true";
    widgetElement.setAttribute("aria-expanded", !isExpanded);
}