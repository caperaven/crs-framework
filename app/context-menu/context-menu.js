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
                { id: "item1", title: "&{approved}", tags: "approved", icon: "approved", type: "console", action: "log", args: { message: "Approved "}, attributes: { "aria-hidden.if": "status == 'b'" } },
                { id: "item2", title: "Browse", tags: "browse", icon: "browse", type: "console", action: "log", args: { message: "Browse "}, styles: { "background": "green"} },
                { id: "item3", title: "Calendar", tags: "calendar", icon: "calendar", type: "console", action: "log", args: { message: "Calendar "} },
                { title: "-" },
                { id: "item4", title: "Condition", tags: "condition", icon: "condition", type: "console", action: "log", args: { message: "Condition "} },
                { id: "item5", title: "Date and Time", tags: "date time", icon: "date-time", type: "console", action: "log", args: { message: "Date and Time "} },
                { id: "item6", title: "Lookup", tags: "lookup", icon: "lookup", type: "console", action: "log", args: { message: "Lookup "} }
            ],

            callback: (event) => console.log(event)
        }, { status: "a" });
    }
}