import "./../../components/context-menu/context-menu-actions.js";

export default class ContextMenu extends crsbinding.classes.ViewBase {
    #handler;

    async connectedCallback() {
        await super.connectedCallback();

        this.#handler = this.#showContext.bind(this);
        this._element.addEventListener('contextmenu', this.#handler);
    }

    async disconnectedCallback() {
        this._element.removeEventListener('contextmenu', this.#handler);
        this.#handler = null;
    }

    async #showContext(event) {
        await crs.call("context_menu", "show", {
            point: {x: event.clientX, y: event.clientY},
            icon_font_family: "crsfrw",

            options: [
                { id: "item 1", icon: "approved", title: "item 1", type: "console", action: "log", args: { message: "Greetings" }},
                { title: "-" },
                { id: "item 2", icon: "browse", title: "item 2", children: [
                        { id: "child 1", icon: "calendar", title: "child 1", type: "console", action: "log", args: { message: "Greetings" }},
                        { id: "child 2", icon: "condition", title: "child 2" },
                ]},
            ]
        })
    }
}