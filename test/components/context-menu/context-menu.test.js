import {beforeAll, describe, it} from "./../../dependencies.js";

describe("Context Menu", async () => {

    beforeAll(async () => {
       await import("./../../../components/context-menu/context-menu-actions.js");
    });

    it("should show titles and templates", async () => {

        // Arrange
        const target = document.createElement("div");

        // Act
        await crs.call("context_menu", "show", {
            element: target,
            icon_font_family: "crsfrw",
            height: 304,
            templates: {"statuses": "<b>${statusCode}</b>&nbsp;<span>${statusDescription}</span>"},
            options: [
                { id: "item1", template: "statuses", statusCode: "AP", statusDescription: "Approved", tags: "approved", icon: "approved", icon_color: "#ff0090", selected: true,  type: "console", action: "log", args: { message: "Approved "}, attributes: { "aria-hidden.if": "status == 'b'" } },
                { id: "item2", title: "Browse", tags: "browse", icon: "browse", icon_color: "#ff9000", type: "console", action: "log", args: { message: "Browse "}, styles: { "background": "green"} },
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
        }, { status: "a" });

        // Assert

    });
});