const BorderOptions = Object.freeze({
    false: "1px solid var(--dark-blue)",
    true: "1px solid var(--red)"
})

export function setCellMarker(element, parentElement, aabb, hasErrors, isVisible) {
    element ||= createCellMarker(parentElement);
    element.style.translate = `${aabb.x1}px ${aabb.y1}px`;
    element.style.width = `${aabb.x2 - aabb.x1 - 2}px`;
    element.style.height = `${aabb.y2 - aabb.y1 - 1}px`;
    element.style.border = BorderOptions[hasErrors];
    element.style.display = isVisible ? "block" : "none";
    return element;
}

function createCellMarker(parentElement) {
    const element = document.createElement("div");
    element.classList.add("cell-marker");
    parentElement.appendChild(element)
    return element
}