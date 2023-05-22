import { beforeAll, beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../../test/mockups/init.js";
import {ColumnsManager} from "../../../../components/data-table/managers/columns-manager.js";

await init();

describe ("ColumnsManager tests", async () => {
    let instance;

    beforeEach(async () => {
        instance = new ColumnsManager();
    });

    afterEach(async () => {
        instance = instance.dispose();
    })

    it("instance is not null", async () => {
        assert(instance !== null);
    });

    it("append", async () => {
        await instance.append("code", 100, "code");
        await instance.append("description", 200, "description");
        assertEquals(instance.gridTemplateColumns, "100px 200px");
        assertEquals(instance.columns, [{title: "code", width: 100, property: "code"}, {title: "description", width: 200, property: "description"}]);
    });

    it ("insert", async () => {
        await instance.append("code", 100, "code");
        await instance.append("description", 200, "description");
        await instance.insert(1, "id", 50, "id");
        assertEquals(instance.gridTemplateColumns, "100px 50px 200px");
        assertEquals(instance.columns, [{title: "code", width: 100, property: "code"}, {title: "id", width: 50, property: "id"}, {title: "description", width: 200, property: "description"}]);
    });

    it ("remove", async () => {
        await instance.append("code", 100, "code");
        await instance.append("description", 200, "description");
        await instance.remove(1);
        assertEquals(instance.gridTemplateColumns, "100px");
        assertEquals(instance.columns, [{title: "code", width: 100, property: "code"}]);
    });

    it ("remove - invalid index", async () => {
        await instance.append("code", 100, "code");
        await instance.append("description", 200, "description");
        await instance.remove(2);
        assertEquals(instance.gridTemplateColumns, "100px 200px");
        assertEquals(instance.columns, [{title: "code", width: 100, property: "code"}, {title: "description", width: 200, property: "description"}]);
    });

    it ("move", async () => {
        await instance.append("code", 100, "code");
        await instance.append("description", 200, "description");
        await instance.move(1, 0);
        assertEquals(instance.gridTemplateColumns, "200px 100px");
        assertEquals(instance.columns, [{title: "description", width: 200, property: "description"}, {title: "code", width: 100, property: "code"}]);
    })

    it ("move - invalid index", async () => {
        await instance.append("code", 100, "code");
        await instance.append("description", 200, "description");
        await instance.move(2, 0);
        assertEquals(instance.gridTemplateColumns, "100px 200px");
        assertEquals(instance.columns, [{title: "code", width: 100, property: "code"}, {title: "description", width: 200, property: "description"}]);
    });

    it ("resize", async () => {
        await instance.append("code", 100, "code");
        await instance.append("description", 200, "description");
        await instance.resize(1, 150);
        assertEquals(instance.gridTemplateColumns, "100px 150px");
        assertEquals(instance.columns, [{title: "code", width: 100, property: "code"}, {title: "description", width: 150, property: "description"}]);
    });

    it ("resize - invalid index", async () => {
        await instance.append("code", 100, "code");
        await instance.append("description", 200, "description");
        await instance.resize(2, 150);
        assertEquals(instance.gridTemplateColumns, "100px 200px");
        assertEquals(instance.columns, [{title: "code", width: 100, property: "code"}, {title: "description", width: 200, property: "description"}]);
    });

    it ("append with translations", async () => {
        await crsbinding.translations.add({
            code: "MyCode"
        }, "test");

        await instance.append("&{test.code}", 100);
        assertEquals(instance.columns[0].title, "MyCode");

        await crsbinding.translations.delete("test");
    });

    it ("insert with translations", async () => {
        await crsbinding.translations.add({
            code: "MyCode"
        }, "test");

        await instance.insert(0, "&{test.code}", 100);
        assertEquals(instance.columns[0].title, "MyCode");

        await crsbinding.translations.delete("test");
    });

    it ("set", async () => {
        await instance.append("code", 100, "code");

        await instance.set([{title: "code", width: 100, property: "code"}, {title: "description", width: 200, property: "description"}]);
        assertEquals(instance.gridTemplateColumns, "100px 200px");
        assertEquals(instance.columns, [{title: "code", width: 100, property: "code"}, {title: "description", width: 200, property: "description"}]);
    });
})
