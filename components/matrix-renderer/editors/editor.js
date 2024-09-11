import {editBoolean} from "./edit-boolean.js";
import {DataType} from "../enums/data-type.js";

export function createEditorLT() {
    return {
        [DataType.TEXT]     : todo,
        [DataType.BOOLEAN]  : editBoolean,
        [DataType.NUMBER]   : todo,
        [DataType.DATE]     : todo,
        [DataType.TIME]     : todo,
        [DataType.DURATION] : todo,
        [DataType.GEO]      : todo,
        [DataType.IMAGE]    : todo,
        [DataType.LINK]     : todo,
    }
}

export function todo(ctx, def, rowIndex, column, aabb) {
    console.log(aabb)

    ctx.save()
    ctx.fillStyle = "blue";
    ctx.fillRect(aabb.x1, aabb.y1, aabb.x2 - aabb.x1, aabb.y2 - aabb.y1);
    ctx.restore()
}