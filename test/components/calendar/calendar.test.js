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

    it('should ', async () => {
        // Arrange

        // Act

        // Assert
        
    });
});