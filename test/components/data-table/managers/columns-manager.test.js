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
        await instance.append("code", 100);
        await instance.append("description", 200);
        assertEquals(instance.widths, [100, 200]);
        assertEquals(instance.columns, [{title: "code", width: 100}, {title: "description", width: 200}]);
    });

    it ("insert", async () => {
        await instance.append("code", 100);
        await instance.append("description", 200);
        await instance.insert(1, "id", 50);
        assertEquals(instance.widths, [100, 50, 200]);
        assertEquals(instance.columns, [{title: "code", width: 100}, {title: "id", width: 50}, {title: "description", width: 200}]);
    });

    it ("remove", async () => {
        await instance.append("code", 100);
        await instance.append("description", 200);
        await instance.remove(1);
        assertEquals(instance.widths, [100]);
        assertEquals(instance.columns, [{title: "code", width: 100}]);
    });

    it ("remove - invalid index", async () => {
        await instance.append("code", 100);
        await instance.append("description", 200);
        await instance.remove(2);
        assertEquals(instance.widths, [100, 200]);
        assertEquals(instance.columns, [{title: "code", width: 100}, {title: "description", width: 200}]);
    });

    it ("move", async () => {
        await instance.append("code", 100);
        await instance.append("description", 200);
        await instance.move(1, 0);
        assertEquals(instance.widths, [200, 100]);
        assertEquals(instance.columns, [{title: "description", width: 200}, {title: "code", width: 100}]);
    })

    it ("move - invalid index", async () => {
        await instance.append("code", 100);
        await instance.append("description", 200);
        await instance.move(2, 0);
        assertEquals(instance.widths, [100, 200]);
        assertEquals(instance.columns, [{title: "code", width: 100}, {title: "description", width: 200}]);
    });

    it ("resize", async () => {
        await instance.append("code", 100);
        await instance.append("description", 200);
        await instance.resize(1, 150);
        assertEquals(instance.widths, [100, 150]);
        assertEquals(instance.columns, [{title: "code", width: 100}, {title: "description", width: 150}]);
    });

    it ("resize - invalid index", async () => {
        await instance.append("code", 100);
        await instance.append("description", 200);
        await instance.resize(2, 150);
        assertEquals(instance.widths, [100, 200]);
        assertEquals(instance.columns, [{title: "code", width: 100}, {title: "description", width: 200}]);
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
})
