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

    static async save_process(step, context, process, item) {
        const instance = document.querySelector("macro-recorder");
        const processName = await crs.call("system", "prompt", { title: "Save process", label: "Process name" });
        return await instance.saveToProcess(processName);
    }
}

crs.intent.macro_recorder = MacroRecorderActions;