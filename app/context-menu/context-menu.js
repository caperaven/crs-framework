import "./../../components/context-menu/context-menu-actions.js";

export default class ContextMenu extends crs.classes.ViewBase {
    #handler = this.#showContext.bind(this);

    async connectedCallback() {
        await super.connectedCallback();
        this.element.addEventListener('contextmenu', this.#handler);
    }

    async disconnectedCallback() {
        this.element.removeEventListener('contextmenu', this.#handler);
        this.#handler = null;
        await super.disconnectedCallback();
    }

    async show(event) {
        await crs.call("context_menu", "show", {
            element: event.composedPath()[0],
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

    async showHierarchy(event) {
        await crs.call("context_menu", "show", {
            element: event.composedPath()[0],
            icon_font_family: "crsfrw",
            options: [
                { id: "item1", title: "Master Item", children: [
                        { id: "sub item 1", title: "sub item 1", children: [
                                { id: "sub item child 1", title: "sub item child 1" },
                                { id: "sub item child 2", title: "sub item child 2" },
                                { id: "sub item child 3", title: "sub item child 3" },
                            ] },
                        { id: "sub item 2", title: "sub item 1" },
                        { id: "sub item 3", title: "sub item 1" }
                    ]}
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