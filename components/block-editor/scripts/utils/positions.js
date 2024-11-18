import { getParentPath } from "./get-path.js";

export const Positions = Object.freeze({
    BEFORE: "before",
    APPEND: "append"
})

export function add(element, targetElement, position) {
    if (position === Positions.BEFORE) {
        targetElement.parentElement.insertBefore(element, targetElement);
    }
    else {
        targetElement.appendChild(element);
    }

    const uuid = crypto.randomUUID()
    const parentPath = getParentPath(targetElement);

    element.id = uuid;
    element.dataset.path = `${parentPath}/#${uuid}`;

    return element.dataset.path;
}
