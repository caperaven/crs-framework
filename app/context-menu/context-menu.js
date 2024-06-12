import "./../../components/context-menu/context-menu-actions.js";

export default class ContextMenu extends crsbinding.classes.ViewBase {
    #handler = this.#showContext.bind(this);

    async connectedCallback() {
        await super.connectedCallback();
        this._element.addEventListener('contextmenu', this.#handler);
    }

    async disconnectedCallback() {
        this._element.removeEventListener('contextmenu', this.#handler);
        this.#handler = null;
        await super.disconnectedCallback();
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

    async showHierarchy(event) {
        await crs.call("context_menu", "show", {
            element: event.target,
            icon_font_family: "crsfrw",
            options: [
                { id: "item1", tags: "master item", title: "Master Item", icon: "browse", icon_color: "#ff9000", children: [
                        { id: "sub item 1", tags: "sub item 1", title: "sub item 1", children: [
                                { id: "sub item child 1", tags: "sub item child 1", title: "sub item child 1", icon: "date-and-time"},
                                { id: "sub item child 2", tags: "sub item child 2", title: "sub item child 2", icon: "condition" },
                                { id: "sub item child 3", tags: "sub item child 3", title: "sub item child 3" }]},
                        { id: "sub item 2", tags: "sub item 2", title: "sub item 2", children: [
                                { id: "sub item child 2.1", tags: "sub item child 1", title: "sub item child 1", icon: "date-and-time"},
                                { id: "sub item child 2.2", tags: "sub item child 2", title: "sub item child 2", icon: "condition" },
                                { id: "sub item child 2.3", tags: "sub item child 3", title: "sub item child 3" }]},
                        { id: "sub item 2", tags: "sub item 2",  title: "sub item 2", icon: "calendar" },
                        { id: "sub item 3", tags: "sub item 3", title: "sub item 3" },
                        { id: "sub item 4", title: "sub Item 4", tags: "item 4" },
                        { id: "sub item 5", title: "sub Item 5", tags: "item 5" },
                        { id: "sub item 6", title: "sub Item 6", tags: "item 6" },
                        { id: "sub item 7", title: "sub Item 7", tags: "item 7" },
                        { id: "sub item 8", title: "sub Item 8", tags: "item 8" },

                    ]
                },
                { id: "item2", title: "Item 2", tags: "item 2", children: [ { id: "sub item 2", tags: "sub item 2", title: "sub item 2", children: [
                            { id: "sub item child 2.1", tags: "sub item child 1", title: "sub item child 1", icon: "date-and-time"},
                            { id: "sub item child 2.2", tags: "sub item child 2", title: "sub item child 2", icon: "condition" },
                            { id: "sub item child 2.3", tags: "sub item child 3", title: "sub item child 3" }]
                    },]},
                { id: "item3", title: "Item 3", tags: "item 3" },
                { id: "item4", title: "Item 4", tags: "item 4" },
                { id: "item5", title: "Item 5", tags: "item 5" },
                { id: "item6", title: "Item 6", tags: "item 6" },
                { id: "item7", title: "Item 7", tags: "item 7" },
                { id: "item8", title: "Item 8", tags: "item 8" },
                { id: "item9", title: "Item 9", tags: "item 9" },
                { id: "item10", title: "Item 10", tags: "item 10" }
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
                { id: "item0", tags: "master item", title: "Master Item", icon: "browse", icon_color: "#ff9000", children: [
                        { id: "sub item 1", tags: "sub item 1", title: "sub item 1", children: [
                                { id: "sub item 0", tags: "sub item 1", title: "sub item 1", children: [
                                        { id: "sub item child 1", tags: "sub item child 1", title: "sub item child 1", icon: "date-and-time"},
                                        { id: "sub item child 2", tags: "sub item child 2", title: "sub item child 2", icon: "condition" },
                                        { id: "sub item child 3", tags: "sub item child 3", title: "sub item child 3" }]},
                                { id: "sub item 1", tags: "sub item 1", title: "sub item 1", children: [
                                        { id: "sub item child 1", tags: "sub item child 1", title: "sub item child 1", icon: "date-and-time"},
                                        { id: "sub item child 2", tags: "sub item child 2", title: "sub item child 2", icon: "condition" },
                                        { id: "sub item child 3", tags: "sub item child 3", title: "sub item child 3" }]},
                                { id: "sub item child 1", tags: "sub item child 1", title: "sub item child 1", icon: "date-and-time"},
                                { id: "sub item child 2", tags: "sub item child 2", title: "sub item child 2", icon: "condition" }]
                        },
                        { id: "sub item 2", tags: "sub item 2", title: "sub item 2", children: [
                                { id: "sub item child 1", tags: "sub item child 1", title: "sub item child 1", icon: "date-and-time"},
                                { id: "sub item child 2", tags: "sub item child 2", title: "sub item child 2", icon: "condition" },
                                { id: "sub item child 3", tags: "sub item child 3", title: "sub item child 3" }]
                        },
                        { id: "sub item 2", tags: "sub item 2",  title: "sub item 1", icon: "calendar" },
                        { id: "sub item 3", tags: "sub item 3", title: "sub item 1" }]},
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

    async showNoFiltering(event) {
        await crs.call("context_menu", "show", {
            element: event.target,
            icon_font_family: "crsfrw",
            templates: {"statuses": "<b>${statusCode}</b>&nbsp;<span>${statusDescription}</span>"},
            filtering: false,
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
}