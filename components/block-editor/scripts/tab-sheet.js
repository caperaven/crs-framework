import { add } from "./utils/positions.js";
import {ValidationResult} from "../../../src/schema/validation-result.js";
import {getPathParts} from "./utils/get-path.js";

const template = `
<tabsheet-widget tabindex="0">
    <div class="tabsheet-header">
        <span data-id="1" data-widget-action="swapTab" contenteditable="true" data-property="title" aria-selected="true">Tab 1</span>
        <span data-id="2" data-widget-action="swapTab" contenteditable="true" data-property="title">Tab 2</span>
        <span data-id="-1" data-widget-action="addTabd">+</span>
    </div>
    
    <div class="tabsheet-body">
        <div id="${crypto.randomUUID()}" data-id="1" data-droptarget="true"></div>
        <div id="${crypto.randomUUID()}" data-id="2" data-droptarget="true" class="hidden"></div>
    </div>
</tabsheet-widget>
`;

export async function createInstance(targetElement, args, position, widgetId, schemaId) {
    const templateElement = document.createElement("template");
    templateElement.innerHTML = template;
    const instance = templateElement.content.cloneNode(true);
    instance.firstElementChild.dataset.widgetId = widgetId;

    // Append the instance to the target element
    const path = add(instance.firstElementChild, targetElement, position);
    const {id, parentPath} = getPathParts(path);

    let result = await crsbinding.events.emitter.emit("schema-actions", {
        action: "create",
        args: [schemaId, parentPath, {
            "element": "tab-sheet", // need this for the provider identification
            "id": id,
            "widgetId": widgetId,
            "title": "Group Box",
        }]
    })

    if (ValidationResult.isError(result)) {
        alert(result.message);
    }
}

export async function addTag(widgetElement, targetElement, widget, event) {
    console.log("addTag");
}

export async function swapTab(widgetElement, targetElement, widget, event) {
    const id = targetElement.dataset.id;

    const currentElement = widgetElement.querySelector(`.tabsheet-body :not(.hidden)`);
    currentElement.classList.add("hidden");

    const selectedElement = widgetElement.querySelector(`.tabsheet-header [aria-selected='true']`);
    selectedElement.removeAttribute("aria-selected");

    const newElement = widgetElement.querySelector(`.tabsheet-body [data-id='${id}']`);
    newElement.classList.remove("hidden");

    targetElement.setAttribute("aria-selected", "true");
}