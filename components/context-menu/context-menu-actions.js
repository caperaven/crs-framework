import "./context-menu.js";

export class ContextMenuActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    static async show(step, context, process, item) {
        const target = await crs.dom.get_element(step.args.element, context, process, item);
        const options = await crs.process.getValue(step.args.options, context, process, item);
        const at = await crs.process.getValue(step.args.at, context, process, item);
        const anchor = await crs.process.getValue(step.args.anchor, context, process, item);
        const point = await crs.process.getValue(step.args.point, context, process, item);
        const margin = await crs.process.getValue(step.args.margin, context, process, item);
        const callback = await crs.process.getValue(step.args.callback, context, process, item);

        if (globalThis.contextMenu != null) {
            await this.close();
        }

        const icon_font_family = await crs.process.getValue(step.args.icon_font_family, context, process, item);
        const height = await crs.process.getValue(step.args.height, context, process, item);

        const instance = document.createElement("context-menu");
        instance.options = options;
        instance.point = point;
        instance.target = target;
        instance.at = at;
        instance.anchor = anchor;
        instance.context = context;
        instance.margin = margin;
        instance.height = height;
        instance.style.setProperty("--icon-font", icon_font_family);

        document.body.appendChild(instance);

        if (callback != null) {
            const fn = (event) => {
                instance.removeEventListener("change", fn);
                callback(event);
            }

            instance.addEventListener("change", fn);
        }

        globalThis.contextMenu = instance;
    }

    static async close() {
        if (globalThis.contextMenu == null) return;

        globalThis.contextMenu.parentElement.removeChild(globalThis.contextMenu);
        delete globalThis.contextMenu;
    }
}

crs.intent.context_menu = ContextMenuActions;