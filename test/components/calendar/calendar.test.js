import {init} from "./../../../test/mockups/init.js";
import {assertEquals, describe, it, beforeEach, beforeAll} from "../../dependencies.js";

await init();

let instance;

beforeAll(async () => {
    await import("./../../../components/calendar/calendar.js");
})

describe("Calendar Component", async () => {

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

    it("check if month text update when goToNext method is called", async () => {
        //Arrange
        const currentMonth = instance.getProperty("selectedMonth");

        //Act
        await instance.goToNext();
        const nextMonth = instance.getProperty("selectedMonth");

        //Assert
        assertEquals(nextMonth, (currentMonth + 1));
    });

    it("check if month text update when goToPrevious method is called", async () => {
        //Arrange
        const currentMonth = instance.getProperty("selectedMonth");

        //Act
        await instance.goToPrevious();
        const nextMonth = instance.getProperty("selectedMonth");

        //Assert
        assertEquals(nextMonth, (currentMonth - 1));
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

    it('should set month property to next month', async () => {

        // Act
        await instance.goToNext();

        const monthValue = instance.getProperty("selectedMonth");
        const yearValue = instance.getProperty("selectedYear");
        const month = new Date(yearValue, monthValue).toLocaleString('en-US', {month: 'long'});

        // Assert
        assertEquals(instance.getProperty("selectedMonthText"), month);
    });

    it('should set month property to previous month', async () => {

        // Act
        await instance.goToPrevious();

        const monthValue = instance.getProperty("selectedMonth");
        const yearValue = instance.getProperty("selectedYear");
        const month = new Date(yearValue, monthValue).toLocaleString('en-US', {month: 'long'});

        // Assert
        assertEquals(instance.getProperty("selectedMonthText"), month);
    });
});
