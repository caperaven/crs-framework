/**
 * This is a enum that defines the intent and action to call for that event.
 * The key is the intent
 * The value is the method on the matrix-renderer to call for that intent.
 * @type {Readonly<{SELECT_LEFT: string, SELECT_RIGHT: string, SELECT_DOWN: string, SELECT_ROW_END: string, SELECT_PAGE_DOWN: string, SELECT_ROW_HOME: string, EDIT_CELL: string, SELECT: string, SELECT_UP: string, SELECT_PAGE_LEFT: string, EDIT_ROW: string, SELECT_PAGE_UP: string, SELECT_PAGE_RIGHT: string, END: string, HOME: string}>}
 */
    export const InputActions = Object.freeze({
        "SELECT"            : "select",
        "SELECT_LEFT"       : "selectLeft",
        "SELECT_RIGHT"      : "selectRight",
        "SELECT_UP"         : "selectUp",
        "SELECT_DOWN"       : "selectDown",
        "SELECT_PAGE_UP"    : "selectPageUp",
        "SELECT_PAGE_DOWN"  : "selectPageDown",
        "SELECT_PAGE_LEFT"  : "selectPageLeft",
        "SELECT_PAGE_RIGHT" : "selectPageRight",
        "SELECT_ROW_HOME"   : "selectRowHome",
        "SELECT_ROW_END"    : "selectRowEnd",
        "SELECT_APPEND"     : "selectAppend",
        "SELECT_POP"        : "selectPop",
        "SELECT_RANGE"      : "selectRange",
        "HOME"              : "home",
        "END"               : "end",
        "EDIT_CELL"         : "editCell",
        "EDIT_ROW"          : "editRow",
        "CUT"               : "cut",
        "COPY"              : "copy",
        "PASTE"             : "paste"
    })