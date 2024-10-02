import {InputActions} from "../enums/input-actions.js";

export class InputManager {
    #data = {
        "click"             : InputActions.SELECT,
        "dblclick"          : InputActions.EDIT_CELL,
        "enter"             : InputActions.EDIT_CELL,
        "numpadenter"       : InputActions.EDIT_CELL,
        "space"             : InputActions.EDIT_CELL,
        "ctrl+dblclick"     : InputActions.EDIT_ROW,
        "ctrl+Space"        : InputActions.EDIT_ROW,
        "arrowleft"         : InputActions.SELECT_LEFT,
        "arrowright"        : InputActions.SELECT_RIGHT,
        "arrowup"           : InputActions.SELECT_UP,
        "arrowdown"         : InputActions.SELECT_DOWN,
        "pageup"            : InputActions.SELECT_PAGE_UP,
        "pagedown"          : InputActions.SELECT_PAGE_DOWN,
        "home"              : InputActions.SELECT_ROW_HOME,
        "end"               : InputActions.SELECT_ROW_END,
        "ctrl+home"         : InputActions.HOME,
        "ctrl+end"          : InputActions.END,
        "tab"               : InputActions.SELECT_RIGHT,
        "shift+tab"         : InputActions.SELECT_LEFT,
        "shift+arrowleft"   : InputActions.SELECT_POP,
        "shift+arrowright"  : InputActions.SELECT_APPEND,
        "shift+arrowdown"   : InputActions.SELECT_APPEND,
        "shift+arrowup"     : InputActions.SELECT_POP,
        "ctrl+keyc"         : InputActions.COPY,
        "ctrl+keyx"         : InputActions.CUT,
        "ctrl+keyv"         : InputActions.PASTE,
    }

    #numKeyMap = {
        "numpad9": "pageup",
        "numpad3": "pagedown",
        "numpad7": "home",
        "numpad1": "end"
    }

    dispose() {
        this.#data = null;

        return null;
    }

    from(config) {
        this.#data = config;
    }

    getInputAction(event) {
        let key = (event.code || event.type).toLowerCase();

        if (key.startsWith("numpad")) {
            let numLock = event.getModifierState("NumLock");
            if (numLock === true) return;

            key = this.#numKeyMap[key];
        }

        if (event.ctrlKey) {
            key = `ctrl+${key}`;
        }

        if (event.shiftKey) {
            key = `shift+${key}`;
        }

        return this.#data[key];
    }
}