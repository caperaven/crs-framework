import {editBoolean} from "./edit-boolean.js";
import {editText} from "./edit-text.js";
import {DataType} from "../enums/data-type.js";

export function createEditorLT() {
    return {
        [DataType.TEXT]     : editText,
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
    return;
}