import "./matrix-text-edit/matrix-text-edit.js"

export function editText(ctx, def, rowIndex, column, aabb, parent) {
    const text = def.rows[rowIndex][column.field];

    const element = document.createElement("matrix-text-editor");
    element.initialize(aabb, text, rowIndex, column.field, def.manager, "text");
    parent.appendChild(element);
}