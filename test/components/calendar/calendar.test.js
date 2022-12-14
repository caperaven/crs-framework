import {assertEquals, beforeAll, describe, it} from "./../../dependencies.js";
import {beforeEach} from "https://deno.land/std@0.157.0/testing/bdd.ts";

describe("Calendar Component", async () => {


    beforeAll(async () => {
        await import("./../../../components/calendar/calendar.js");
    });

    it('should check if onload default view is set by default', async () => {
        // Arrange
        const instance = document.createElement("calendar-component");
        await instance.connectedCallback();

        // Act
        await instance.viewLoaded();

        // Assert
        assertEquals(instance.getProperty("selectedView"), "default");
    });

    it('should view changes to month view on perspective element by setting selectedView property', async () => {
        // Arrange
        const instance = document.createElement("calendar-component");
        await instance.connectedCallback();

        // Act
        instance.setProperty("selectedView", "months");

        // Assert
        assertEquals(instance.getProperty("selectedView"), "months");
    });

    it('should view changes to year view on perspective element by setting selectedView property', async () => {
        // Arrange
        const instance = document.createElement("calendar-component");
        await instance.connectedCallback();

        // Act
        instance.setProperty("selectedView", "years");

        // Assert
        assertEquals(instance.getProperty("selectedView"), "years");
    });

    it('should have correct month property name based on the value passed in selectedMonthChanged(value)', async () => {
        // Arrange
        const instance = document.createElement("calendar-component");
        await instance.connectedCallback();

        // Act
        await instance.selectedMonthChanged(0);

        // Assert
        assertEquals(instance.getProperty("month"), "January");
        assertEquals(instance.getAttribute("data-month"), 1);
    });

    it('should have correct year property name based on the value passed in selectedYearChanged(value)', async () => {
        // Arrange
        const instance = document.createElement("calendar-component");
        await instance.connectedCallback();

        // Act
        await instance.selectedYearChanged(2022);

        // Assert
        assertEquals(instance.getProperty("year"), 2022);
        assertEquals(instance.getAttribute("data-year"),2022);
    });

    it('should set month property to next month', async () => {
        // Arrange
        const instance = document.createElement("calendar-component");
        await instance.connectedCallback();

        // Act
        await instance.goToNextMonth();
        const monthValue = instance.getProperty("selectedMonth");
        const yearValue = instance.getProperty("selectedYear");
        const month = new Date(yearValue,monthValue).toLocaleString('en-US', {month: 'long'});

        // Assert
        assertEquals(instance.getProperty("month"), month);
    });

    it('should set month property to previous month', async () => {
        // Arrange
        const instance = document.createElement("calendar-component");
        await instance.connectedCallback();

        // Act
        await instance.goToPreviousMonth();
        const monthValue = instance.getProperty("selectedMonth");
        const yearValue = instance.getProperty("selectedYear");
        const month = new Date(yearValue,monthValue).toLocaleString('en-US', {month: 'long'});

        // Assert
        assertEquals(instance.getProperty("month"), month);
    });

    it('should set data-month to month passed through data-start attribute', async () => {
        // Arrange
        const instance = document.createElement("calendar-component");
        await instance.connectedCallback();
        const dateISO = new Date(2022,1).toISOString();

        // Act
        instance.setAttribute("data-start", dateISO);

        // Assert
        assertEquals(instance.getAttribute("data-month"), 2);
        assertEquals(instance.getProperty("month"), "February");
    });

    it('should set data-year to year passed through attributeChangedCallback method', async () => {
        // Arrange
        const instance = document.createElement("calendar-component");
        await instance.connectedCallback();
        const dateISO = new Date().toISOString();
        const newDateISO = new Date(2023,1).toISOString();

        // Act
        await instance.attributeChangedCallback("data-start", dateISO, newDateISO);

        // Assert
        assertEquals(instance.getAttribute("data-year"), 2023);
        assertEquals(instance.getProperty("year"), 2023);
    });
});

describe('Calendar Component Edge Cases', async () => {
    it('should return default selected month if selected month value is null', async () => {
        // Arrange
        const instance = document.createElement("calendar-component");
        await instance.connectedCallback();
        const month = new Date().getMonth();

        // Act
        await instance.selectedMonthChanged(null);
        // Assert
        assertEquals(instance.getProperty("selectedMonth"), month);
        assertEquals(instance.getAttribute("data-month"), month + 1);
    });

    it('should return default selected year if selected year value is invalid', async () => {
        // Arrange
        const instance = document.createElement("calendar-component");
        await instance.connectedCallback();
        const year = new Date().getFullYear();

        // Act
        await instance.selectedYearChanged(2);

        // Assert
        assertEquals(instance.getProperty("selectedYear"), year);
        assertEquals(instance.getAttribute("data-year"), year);
    });

    it('should return default selected year if selected year value is null', async () => {
        // Arrange
        const instance = document.createElement("calendar-component");
        await instance.connectedCallback();
        const year = new Date().getFullYear();

        // Act
        await instance.selectedYearChanged(null);

        // Assert
        assertEquals(instance.getProperty("selectedYear"), year);
        assertEquals(instance.getAttribute("data-year"), year);
    });
});