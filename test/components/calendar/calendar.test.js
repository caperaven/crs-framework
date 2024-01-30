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

    it("selectedDate should dispatch the correct date format", async () => {
        //Arrange
        const dispatchStub = stub(instance, "dispatchEvent", (event) => {
            assertEquals(instance.getAttribute("data-start"), "2024-01-05");
            assertEquals(event.detail.date, "2024-01-05");
        });

        const target = document.createElement("div");
        target.setAttribute("role", "cell");
        target.dataset.year = "2024";
        target.dataset.month = "0";
        target.dataset.day = "5";
        instance.dataset.start = "2024-01-05";

        //Act
        instance.selectedDate(null, target);
    })
})




