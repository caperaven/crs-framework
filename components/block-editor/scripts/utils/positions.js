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
}