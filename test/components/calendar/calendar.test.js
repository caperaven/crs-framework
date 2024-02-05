import {afterEach, beforeEach, beforeAll, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {assertEquals} from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";
import {stub} from "https://deno.land/std@0.157.0/testing/mock.ts";

await init();
let instance;

async function createInstance(nullable = false) {
    instance = document.createElement("calendar-component");

    const perspectiveElementMock = document.createElement("perspective-element");
    const tplCellMock = document.createElement("template");
    const tplYearsMock = document.createElement("template");

    perspectiveElementMock.id = "perspectiveElement";
    tplCellMock.id = "tplCell";
    tplYearsMock.id = "tplYears";

    instance.shadowRoot.appendChild(perspectiveElementMock);
    instance.shadowRoot.appendChild(tplCellMock);
    instance.shadowRoot.appendChild(tplYearsMock);

    instance.setAttribute("data-start", "2024-01-01");
    await instance.preLoad();
    await instance.load();
}

beforeAll(async () => {
    await import("../../../components/calendar/calendar.js");

    await crs.call("translations", "add", {
        context: "calendar",
        translations: {
            "january": "January",
            "february": "February",
            "march": "March",
            "april": "April",
            "may": "May",
            "june": "June",
            "july": "July",
            "august": "August",
            "september": "September",
            "october": "October",
            "november": "November",
            "december": "December",
        }
    });
});

describe ("calendar tests", async () => {
    beforeEach(async () => {
        await createInstance();
    })

    afterEach(async () => {
        await instance.disconnectedCallback();
    });

    it("check instance is not null", async () => {
        assertEquals(instance != null, true);
    });

    it("selectedDate should dispatch the correct date format using timezone set to Mexico City", async () => {
        //Arrange
        const initialMexicanTime = new Date("2024-01-05T00:00:00.000").toLocaleString("en-US", {timeZone: "America/Mexico_City"});
        instance.setAttribute("data-start", initialMexicanTime);

        const dispatchStub = stub(instance, "dispatchEvent", (event) => {
            assertEquals(instance.getAttribute("data-start"), "2024-01-09");
            assertEquals(event.detail.date, "2024-01-09");
        });

        const target = document.createElement("div");
        target.setAttribute("role", "cell");

        const updatedMexicanTime =  new Date(new Date("2024-01-10T00:00:00.000").toLocaleString("en-US", {timeZone: "America/Mexico_City"}));
        target.dataset.year = updatedMexicanTime.getFullYear();
        target.dataset.month = updatedMexicanTime.getMonth();
        target.dataset.day = updatedMexicanTime.getDate();
        instance.dataset.start = updatedMexicanTime.toISOString().split('T')[0];

        //Act
        instance.selectedDate(null, target);
    })

    it("selectedDate should dispatch the correct date format using timezone set to Tokyo", async () => {
        //Arrange
        const initialTokyoTime = new Date("2024-01-05T00:00:00.000").toLocaleString("en-US", {timeZone: "Asia/Tokyo"});
        instance.setAttribute("data-start", initialTokyoTime);

        const dispatchStub = stub(instance, "dispatchEvent", (event) => {
            assertEquals(instance.getAttribute("data-start"), "2024-01-10");
            assertEquals(event.detail.date, "2024-01-10");
        });

        const target = document.createElement("div");
        target.setAttribute("role", "cell");

        const updatedTokyoTime = new Date(new Date("2024-01-10T00:00:00.000").toLocaleString("en-US", {timeZone: "Asia/Tokyo"}));
        target.dataset.year = updatedTokyoTime.getFullYear();
        target.dataset.month = updatedTokyoTime.getMonth();
        target.dataset.day = updatedTokyoTime.getDate();
        instance.dataset.start = updatedTokyoTime.toISOString().split('T')[0];

        //Act
        instance.selectedDate(null, target);
    })
})




