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

    async show(event) {
        await crs.call("context_menu", "show", {
            element: event.target,
            icon_font_family: "crsfrw",
            height: 304,
            templates: {"statuses": "<b>${statusCode}</b>&nbsp;<span>${statusDescription}</span>"},
            options: [
                { id: "item1", template: "statuses", statusCode: "AP", statusDescription: "Approved", tags: "approved", icon: "approved", icon_color: "#ff0090", selected: true,  type: "console", action: "log", args: { message: "Approved "}, attributes: { "aria-hidden.if": "status == 'b'" } },
                { id: "item2", title: "Browse", tags: "browse", icon: "browse", icon_color: "#ff9000", type: "console", action: "log", args: { message: "Browse "}, styles: { "background": "green"} },
                { id: "item3", title: "Calendar", tags: "calendar", icon: "calendar", type: "console", action: "log", args: { message: "Calendar "} },
                { title: "-" },
                { id: "item4", title: "Condition", tags: "condition", icon: "condition", type: "console", action: "log", args: { message: "Condition "} },
                { id: "item5", title: "Date and Time", tags: "date time", icon: "date-and-time", type: "console", action: "log", args: { message: "Date and Time "} },
                { id: "item6", title: "Lookup", tags: "lookup", icon: "lookup", type: "console", action: "log", args: { message: "Lookup "} },
                { title: "-" },
                { id: "item4", title: "Condition", tags: "condition", icon: "condition", type: "console", action: "log", args: { message: "Condition "} },
                { id: "item5", title: "Date and Time", tags: "date time", icon: "date-and-time", type: "console", action: "log", args: { message: "Date and Time "} },
                { id: "item6", title: "Lookup", tags: "lookup", icon: "lookup", type: "console", action: "log", args: { message: "Lookup "} }
            ],
        }, { status: "a" });
    }

    async #showContext(event) {
        await crs.call("context_menu", "show", {
            point: {x: event.clientX, y: event.clientY},
            icon_font_family: "crsfrw",

            /**
             * 1. add icon colors
             * 2. mark item as selected
             * 3. pass on at and anchor properties
             */

            options: [
                { id: "item1", title: "&{approved}", tags: "approved", icon: "approved", icon_color: "#ff0090", type: "console", action: "log", args: { message: "Approved "}, attributes: { "aria-hidden.if": "status == 'b'" } },
                { id: "item2", title: "Browse", tags: "browse", icon: "browse", type: "console", action: "log", args: { message: "Browse "}, styles: { "background": "green"} },
                { id: "item3", title: "Calendar", tags: "calendar", icon: "calendar", type: "console", action: "log", args: { message: "Calendar "} },
                { title: "-" },
                { id: "item4", title: "Condition", tags: "condition", icon: "condition", type: "console", action: "log", args: { message: "Condition "} },
                { id: "item5", title: "Date and Time", tags: "date time", icon: "date-time", type: "console", action: "log", args: { message: "Date and Time "} },
                { id: "item6", title: "Lookup", tags: "lookup", icon: "lookup", type: "console", action: "log", args: { message: "Lookup "} },
                { title: "-" },
                { id: "item4", title: "Condition", tags: "condition", icon: "condition", type: "console", action: "log", args: { message: "Condition "} },
                { id: "item5", title: "Date and Time", tags: "date time", icon: "date-time", type: "console", action: "log", args: { message: "Date and Time "} },
                { id: "item6", title: "Lookup", tags: "lookup", icon: "lookup", type: "console", action: "log", args: { message: "Lookup "} }
            ],

            callback: (event) => console.log(event)
        }, { status: "a" });
    }
}