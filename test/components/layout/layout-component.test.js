import {assertEquals, beforeAll, beforeEach, describe, it} from "../../dependencies.js";
import {init} from "../../mockups/init.js";
import {createChildrenFromHtml} from "../../mockups/child-mock-factory.js";


await init();

describe("Layout", () => {
    let instance;
    beforeAll(async () => {
        await import("../../../components/layout-container/layout-container.js");
    });

    beforeEach(async () => {
        instance = document.createElement("layout-container");
    });

    it("should have grid-template-columns and grid-template-rows", async () => {
        instance.dataset.columns = "1fr 1fr 1fr";
        instance.dataset.rows = "1fr";

        await instance.load();
        const styles = instance.style;

        assertEquals(styles.gridTemplateColumns, "1fr 1fr 1fr");
        assertEquals(styles.gridTemplateRows, "1fr");
    });

    it("should set not grid-template-rows or grid-template-columns if columns or rows = null/empty", async () => {
        await instance.load();
        const styles = instance.style;

        assertEquals(styles.gridTemplateColumns, "");
        assertEquals(styles.gridTemplateRows, "");
    });
    
});