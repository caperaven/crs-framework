import "./macro-recorder.js";

export class MacroRecorderActions {
    static async show(step, context, process, item) {
        const instance = document.createElement("macro-recorder");
        document.body.appendChild(instance);
    }

    static async close(step, context, process, item) {
        const instance = document.querySelector("macro-recorder");
        instance?.remove();
    }
}

crs.intent.macro_recorder = MacroRecorderActions;