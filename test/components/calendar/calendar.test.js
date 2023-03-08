import {init} from "./../../../test/mockups/init.js";
import {assertEquals, describe, it, beforeEach, beforeAll} from "../../dependencies.js";

await init();

let instance;

beforeAll(async () => {
    await import("./../../../components/calendar/calendar.js");
})

//Discuss with JHR I need the childMockFactory not to replace . with _ in the html.
describe.ignore("Calendar Component", async () => {

    beforeEach(async () => {
        instance = document.createElement("calendar-component");
        await instance.connectedCallback();
    });

    it('should check if onload default view is set by default', async () => {
        // Arrange
        const currentView = instance.getProperty("selectedView");

        // Assert
        assertEquals(currentView, "default");
    });

    it('should view changes to month view on perspective element by setting selectedView property', async () => {
        // Act
        instance.setProperty("selectedView", "months");

        // Assert
        assertEquals(instance.getProperty("selectedView"), "months");
    });

    it('should view changes to year view on perspective element by setting selectedView property', async () => {
        // Act
        instance.setProperty("selectedView", "years");

        // Assert
        assertEquals(instance.getProperty("selectedView"), "years");
    });

    it('should have set month property name based on the value passed in', async () => {

        // Act
        await instance.setProperty("selectedMonth", 0);

        // Assert
        assertEquals(instance.getProperty("selectedMonthText"), "January");
    });

    it('should have set year property name based on the value passed in', async () => {

        // Act
        await instance.setProperty("selectedYear", 0);

        // Assert
        assertEquals(instance.getProperty("selectedYearText"), 2023);
    });

    it('should set month property to month passed through data-start attribute', async () => {
        // Arrange
        const dateISO = new Date(2022, 1).toISOString();

        // Act
        instance.setAttribute("data-start", dateISO);

        // Assert
        assertEquals(instance.getProperty("selectedMonthText"), "February");
    });

    it('should set year property to year passed through attributeChangedCallback method', async () => {
        // Arrange
        const dateISO = new Date().toISOString();
        const newDateISO = new Date(2022, 1).toISOString();

        // Act
        await instance.attributeChangedCallback("data-start", dateISO, newDateISO);

        // Assert
        assertEquals(instance.getProperty("selectedYearText"), 2022);
    });

    it('should return default selected month if selected month value is null', async () => {
        // Arrange
        const month = new Date().getMonth();

        // Act
        await instance.selectedMonthChanged(null);

        // Assert
        assertEquals(instance.getProperty("selectedMonth"), month);
    });

    it('should return default selected month if selected month value is an empty string', async () => {
        // Arrange
        const month = new Date().getMonth();

        // Act
        await instance.selectedMonthChanged("");

        // Assert
        assertEquals(instance.getProperty("selectedMonth"), month);
    });

    it('should return default selected month if selected month value is an invalid value', async () => {
        // Arrange
        const month = new Date().getMonth();

        // Act
        await instance.selectedMonthChanged("Jan");

        // Assert
        assertEquals(instance.getProperty("selectedMonth"), month);
    });

    it('should return default selected year if selected year value has length less than 4', async () => {
        // Arrange
        const year = new Date().getFullYear();

        // Act
        await instance.selectedYearChanged(2);

        // Assert
        assertEquals(instance.getProperty("selectedYear"), year);
    });

    it('should return default selected year if selected year value is null', async () => {
        // Arrange
        const year = new Date().getFullYear();

        // Act
        await instance.selectedYearChanged(null);

        // Assert
        assertEquals(instance.getProperty("selectedYear"), year);
    });

    it('should return default selected year if selected year value is empty string', async () => {
        // Arrange
        const year = new Date().getFullYear();

        // Act
        await instance.selectedYearChanged("");

        // Assert
        assertEquals(instance.getProperty("selectedYear"), year);
    });

    it('should return default selected year if selected year value is non-degit string', async () => {
        // Arrange
        const year = new Date().getFullYear();

        // Act
        await instance.selectedYearChanged("word");

        // Assert
        assertEquals(instance.getProperty("selectedYear"), year);
    });
});
