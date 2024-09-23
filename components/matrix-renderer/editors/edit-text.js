import "./matrix-text-edit/matrix-text-edit.js"

export function editText(ctx, def, rowIndex, column, aabb, parent) {
    const text = def.rows[rowIndex][column.field];
    const errorKey = `${rowIndex},${column.index}`;
    const hasError = def.errors?.[errorKey] != null;

    const element = document.createElement("matrix-text-editor");
    element.dataset.error = hasError;
    element.initialize(aabb, text, rowIndex, column.field, def.manager, "text");
    parent.appendChild(element);
}