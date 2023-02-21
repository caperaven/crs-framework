import {init} from "./../../../test/mockups/init.js";
import {assertEquals, describe, it,beforeEach,beforeAll} from "../../dependencies.js";
await init();

let module,instance;

beforeAll(async () => {
    module = await import("./../../../components/calendar/calendar.js");
})

describe("Calendar Component", async () => {

    it('should check if onload default view is set by default', async () => {
        // Arrange
        const instance = document.createElement("calendar-component");
        await instance.load();
        // Act
        const current_view = instance.getProperty("selectedView");
        // Assert
        assertEquals(current_view, "default");
    });



});
