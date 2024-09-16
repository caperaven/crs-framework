import {InputActions} from "../enums/input-actions.js";

export class InputManager {
    #data = {
        "click"         : InputActions.SELECT,
        "dblclick"      : InputActions.EDIT_CELL,
        "Enter"         : InputActions.EDIT_CELL,
        "NumpadEnter"   : InputActions.EDIT_CELL,
        "Space"         : InputActions.EDIT_CELL,
        "Ctrl+dblclick" : InputActions.EDIT_ROW,
        "Ctrl+Space"    : InputActions.EDIT_ROW,
        "ArrowLeft"     : InputActions.SELECT_LEFT,
        "ArrowRight"    : InputActions.SELECT_RIGHT,
        "ArrowUp"       : InputActions.SELECT_UP,
        "ArrowDown"     : InputActions.SELECT_DOWN,
        "PageUp"        : InputActions.SELECT_PAGE_UP,
        "PageDown"      : InputActions.SELECT_PAGE_DOWN,
        "Home"          : InputActions.SELECT_ROW_HOME,
        "End"           : InputActions.SELECT_ROW_END,
        "Shift+Home"    : InputActions.HOME,
        "Shift+End"     : InputActions.END,
        "Tab"           : InputActions.SELECT_RIGHT,
        "Shift+Tab"     : InputActions.SELECT_LEFT,
    }

    dispose() {
        this.#data = null;

        return null;
    }

    from(config) {
        this.#data = config;
    }

    getInputAction(event) {
        let key = event.code || event.type;

        if (event.ctrlKey) {
            key = `Ctrl+${key}`;
        }

        if (event.shiftKey) {
            key = `Shift+${key}`;
        }

        return this.#data[key];
    }
}