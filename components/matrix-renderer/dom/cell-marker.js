import "./../managers/overlays/marker-overlay/marker-overlay.js";

const BorderOptions = Object.freeze({
    false: "var(--dark-blue)",
    true: "var(--red)"
})

export function setCellMarker(element, parentElement, aabb, hasErrors, isVisible) {
    element ||= createCellMarker(parentElement);
    element.style.translate = `${aabb.x1}px ${aabb.y1}px`;
    element.style.width = `${aabb.x2 - aabb.x1 - 2}px`;
    element.style.height = `${aabb.y2 - aabb.y1 - 1}px`;
    element.style.display = isVisible ? "block" : "none";
    element.style.setProperty("--border-color", BorderOptions[hasErrors]);
    return element;
}

function createCellMarker(parentElement) {
    const element = document.createElement("marker-overlay");
    element.classList.add("cell-marker");
    parentElement.appendChild(element)
    return element
}