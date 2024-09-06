/**
 * Header renderer renders the column header.
 * This is normally just text but in future we can have status icons on the header.
 * For example, we can have error in the data for this column but on a row that is not visible.
 * In that case render the column text and an error icon.
 *
 * Additionally,
 * 1. Render filter icon.
 * 2. Resize icon.
 * 3. Status icon/s.
 *
 * We can also have a boolean type column for select all.
 */

const PADDING_X = 8;
const PADDING_Y = 16;

export function renderHeader(ctx, def, column, aabb) {
    ctx.fillText(column.title, aabb.x1 + PADDING_X, aabb.y2 - PADDING_Y);
}