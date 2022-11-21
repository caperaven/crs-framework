import { beforeAll, afterAll, afterEach, beforeEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assertExists, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";

await init();

beforeAll(async () => {
    const module = await import("../../../components/masked-input/masked-input.js");
    globalThis.MaskManager = module.MaskManager;
    globalThis.maskToText = module.maskToText;
    globalThis.canEdit = module.canEdit;
})

describe("mask input tests", () => {
    it("maskToText", async () => {
        let text = maskToText("##-##-####");
        console.assert(text, "__-__-____");
    })

    it("canEdit", async () => {
        assertEquals(canEdit("0", "1"), true);
        assertEquals(canEdit("0", "a"), false);
        assertEquals(canEdit("#", "1"), true);
        assertEquals(canEdit("#", "a"), true);
        assertEquals(canEdit("_", "1"), false);
        assertEquals(canEdit("_", "a"), true);
    })

    it("masked-input - set mask text", async () => {
        const manager = new MaskManager("(000) 00 000");
        assertEquals(manager.value, "(___) __ ___");
        assertEquals(manager.currentIndex, 1);
    })

    it("masked-input - set char", async () => {
        const manager = new MaskManager("(000) 00 000");
        assertEquals(manager.value, "(___) __ ___");
        assertEquals(manager.currentIndex, 1);

        manager.set("1");
        assertEquals(manager.value, "(1__) __ ___");

        manager.setCursor(0);
        manager.set("2");
        assertEquals(manager.value, "(2__) __ ___");

        manager.set("a");
        assertEquals(manager.value, "(2__) __ ___");
    })

    it("masked-input - set char full", async () => {
        const manager = new MaskManager("(000) 00 000");
        assertEquals(manager.value, "(___) __ ___");

        manager.set(0);
        manager.set(1);
        manager.set(2);
        manager.set(3);
        manager.set(4);
        manager.set(5);
        manager.set(6);
        manager.set(7);
        manager.set(8);
        manager.set(9);
        assertEquals(manager.value, "(012) 34 567");
        assertEquals(manager.currentIndex,12);
    })

    it("mask-input - jump back", async () => {
        const manager = new MaskManager("00 0");
        assertEquals(manager.value, "__ _");

        manager.set(0);
        manager.set(1);
        manager.set(2);
        assertEquals(manager.value, "01 2");
        assertEquals(manager.currentIndex, 4);

        manager.clearBack();
        assertEquals(manager.value, "01 _");
        assertEquals(manager.currentIndex, 3);

        manager.clearBack();
        assertEquals(manager.value, "0_ _");
        assertEquals(manager.currentIndex, 1);

        manager.clearBack();
        assertEquals(manager.value, "__ _");
        assertEquals(manager.currentIndex, 0);

        manager.clearBack();
        assertEquals(manager.value, "__ _");
        assertEquals(manager.currentIndex, 0);
    })

    it("mask-input - clear", async () => {
        const manager = new MaskManager("(000) 00 000");
        assertEquals(manager.value, "(___) __ ___");

        manager.set(0);
        manager.set(1);
        manager.set(2);
        manager.set(3);
        manager.set(4);
        manager.set(5);
        manager.set(6);
        manager.set(7);
        manager.set(8);
        manager.set(9);
        assertEquals(manager.value, "(012) 34 567");

        manager.clear();
        assertEquals(manager.value, "(___) __ ___");
    })

    it("masked-input - clearBack", async () => {
        const manager = new MaskManager("(000) 00 000");
        assertEquals(manager.value, "(___) __ ___");

        manager.set(0);
        manager.set(1);
        manager.set(2);
        manager.set(3);
        manager.set(4);
        manager.set(5);
        manager.set(6);
        manager.set(7);
        manager.set(8);
        manager.set(9);
        assertEquals(manager.value, "(012) 34 567");
        // assertEquals(manager.currentIndex,11);

        manager.clearBack();
        assertEquals(manager.value, "(012) 34 56_");
        // assertEquals(manager.currentIndex,10);

        manager.clearBack();
        assertEquals(manager.value, "(012) 34 5__");
        // assertEquals(manager.currentIndex,9);

        manager.clearBack();
        manager.clearBack();
        assertEquals(manager.value, "(012) 3_ ___");
        // assertEquals(manager.currentIndex,6);

        manager.set(9);
        assertEquals(manager.value, "(012) 39 ___");
        // assertEquals(manager.currentIndex,8);
    })
})

