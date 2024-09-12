export function editText(ctx, def, rowIndex, column, aabb, parent) {
    if (column.editable ?? false) {
        return;
    }
    
    const textValue = def.rows[rowIndex][column.field];
    ctx.fillStyle = "white"
    ctx.fillRect( aabb.x1, aabb.y1, aabb.x2 - aabb.x1, aabb.y2 - aabb.y1);
    createEditElement(textValue, parent, aabb);
}

function createEditElement(text, parentElement, aabb) {
    const div = document.createElement("div");
    div.contentEditable = "true";
    div.textContent = text;
    div.style.position = "absolute";
    div.style.left = "0px";
    div.style.top = "0px";
    div.style.width = `${aabb.x2 - aabb.x1}px`;
    div.style.height = `${aabb.y2 - aabb.y1}px`;
    div.style.translate = `${aabb.x1}px ${aabb.y1}px`;
    div.style.background = "transparent";
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.paddingLeft = "0.5rem";
    div.style.boxSizing = "border-box";
    div.style.fontFamily = "Arial";
    div.style.fontSize = "16px";
    div.style.borderRadius = 0;
    div.style.outline = "none";
    div.addEventListener("blur", onEditElementBlur);
    parentElement.appendChild(div);
    moveCaretToEnd(div);
}

function moveCaretToEnd(contentEditableElement) {
    const range = document.createRange();
    const selection = window.getSelection();

    // Ensure the contenteditable element is focused
    contentEditableElement.focus();

    // Set the range to the end of the content
    range.selectNodeContents(contentEditableElement);
    range.collapse(false);  // Collapse the range to the end

    // Clear any current selection and set the new range
    selection.removeAllRanges();
    selection.addRange(range);
}

function onEditElementBlur(event) {
    const div = event.target;

    div.removeEventListener("blur", onEditElementBlur);
    div.remove();
}