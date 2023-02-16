import {assertEquals, beforeAll, describe, it} from "./../../dependencies.js";

describe("Context Menu", async () => {

    beforeAll(async () => {
        await import("./../../../components/context-menu/context-menu.js");
    });

    /** TODO: I would prefer to use crs.call here but need some infrastructure work on the dom mock to handle
     automatic calls to connectedCallback and disconnectedCallback
     **/
    it("should show titles and templates", async () => {
        // Arrange
        const contextMenu = document.createElement("context-menu");
        contextMenu.options = [
            {
                id: "item1",
                template: "statuses",
                statusCode: "AP",
                statusDescription: "&{approved}",
                tags: "approved",
                icon: "approved",
                icon_color: "#ff0090",
                selected: true,
                type: "console",
                action: "log",
                args: {message: "Approved "},
                attributes: {"aria-hidden.if": "status == 'b'"}
            },
            {
                id: "item2",
                title: "Browse",
                tags: "browse",
                icon: "browse",
                icon_color: "#ff9000",
                type: "console",
                action: "log",
                args: {message: "Browse "},
                styles: {"background": "green"}
            }
        ]
        contextMenu.templates = {"statuses": "<b>${statusCode}</b>&nbsp;<span>${statusDescription}</span>"};
        contextMenu.container = document.createElement("div");
        contextMenu.target = document.createElement("div");
        contextMenu.shadowRoot.queryResults[".popup"] = document.createElement("ul");
        contextMenu.popup = document.createElement("div");
        contextMenu.context = {status: "b"};

        // Act
        await contextMenu.connectedCallback();

        // Assert
        assertEquals(contextMenu.container.children[0].children.length, 2);
        //assertEquals(contextMenu.container.children[0].children[0].children[0].innerHTML, "<b>AP</b>&nbsp;<span>Approved</span>");
        assertEquals(contextMenu.container.children[0].children[1].textContent, "Browse");
        assertEquals(contextMenu.container.children[0].children[0].getAttribute("aria-hidden"), "true");

        // Dispose
        await contextMenu.disconnectedCallback();
    });

    it ("hierarchies", async () => {

    });
});