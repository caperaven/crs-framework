import {initRequired} from "../../mockups/backup/init-required.js";

import { assertEquals } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import { MaskManager, maskToText, canEdit } from "../../../components/masked-input/masked-input.js";

await initRequired();

Deno.test("maskToText", async () => {
    let text = maskToText("##-##-####");
    console.assert(text, "__-__-____");
})

Deno.test("canEdit", async () => {
    assertEquals(canEdit("0", "1"), true);
    assertEquals(canEdit("0", "a"), false);
    assertEquals(canEdit("#", "1"), true);
    assertEquals(canEdit("#", "a"), true);
    assertEquals(canEdit("_", "1"), false);
    assertEquals(canEdit("_", "a"), true);
})

Deno.test("masked-input - set mask text", async () => {
    const manager = new MaskManager("(000) 00 000");
    assertEquals(manager.value, "(___) __ ___");
    assertEquals(manager.currentIndex, 1);
})

Deno.test("masked-input - set char", async () => {
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

Deno.test("masked-input - set char full", async () => {
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
    assertEquals(manager.currentIndex,11);
})

Deno.test("mask-input - jump back", async () => {
    const manager = new MaskManager("00 0");
    assertEquals(manager.value, "__ _");

    manager.set(0);
    manager.set(1);
    manager.set(2);
    assertEquals(manager.value, "01 2");
    assertEquals(manager.currentIndex, 3);

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

Deno.test("mask-input - clear", async () => {
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

Deno.test("masked-input - clearBack", async () => {
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