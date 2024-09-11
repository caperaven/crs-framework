export function setCellMarker(element, parentElement, aabb) {
    element ||= createCellMarker(parentElement);
    element.style.translate = `${aabb.x1}px ${aabb.y1}px`;
    element.style.width = `${aabb.x2 - aabb.x1}px`;
    element.style.height = `${aabb.y2 - aabb.y1 - 1}px`;
    return element;
}

function createCellMarker(parentElement) {
    const element = document.createElement("div");
    element.style.border = "1px solid blue";
    element.style.position = "absolute";
    element.style.top = "0px";
    element.style.left = "0px";

    parentElement.appendChild(element)
    return element
}