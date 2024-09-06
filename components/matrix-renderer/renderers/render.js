import {DataType} from "../enums/data-type.js";
import {renderHeader} from "./render-header.js";
import {renderText} from "./render-text.js";
import {renderBoolean} from "./render-boolean.js";
import {renderCanvas} from "./render-canvas.js";

/**
 * Create a render lookup table for the given data type and areas
 */
function createRenderLT() {
    return {
        "header"            : renderHeader,
        [DataType.TEXT]     : renderText,
        [DataType.BOOLEAN]  : renderBoolean,
        [DataType.NUMBER]   : renderText,
        [DataType.DATE]     : renderText,
        [DataType.TIME]     : renderText,
        [DataType.DURATION] : renderText,
        [DataType.GEO]      : renderText,
        [DataType.IMAGE]    : todo,
        [DataType.LINK]     : todo,
    }
}

// temp function to avoid null references on renderers not yet implemented
function todo() {
    return;
}

export { createRenderLT, renderCanvas };