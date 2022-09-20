import {initRequired} from "./../../mockups/init-required.js";

import { assertEquals } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import { MaskManager, maskToText, canEdit } from "./../../../components/maked-input/masked-input.js";

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
    assertEquals(manager.text, "(___) __ ___");
    assertEquals(manager.values.length, 12);
    assertEquals(manager._index, 1);
})

Deno.test("masked-input - set char", async () => {
    const manager = new MaskManager("(000) 00 000");
    assertEquals(manager.text, "(___) __ ___");
    assertEquals(manager._index, 1);

    manager.set("1");
    assertEquals(manager.text, "(1__) __ ___");

    manager.setCursor(0);
    manager.set("2");
    assertEquals(manager.text, "(2__) __ ___");

    manager.set("a");
    assertEquals(manager.text, "(2__) __ ___");
})

Deno.test("masked-input - set char full", async () => {
    const manager = new MaskManager("(000) 00 000");
    assertEquals(manager.text, "(___) __ ___");

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
    assertEquals(manager.text, "(012) 34 567");
    assertEquals(manager._index,11);
})

Deno.test("mask-input - jump back", async () => {
    const manager = new MaskManager("00 0");
    assertEquals(manager.text, "__ _");

    manager.set(0);
    manager.set(1);
    manager.set(2);
    assertEquals(manager.text, "01 2");
    assertEquals(manager._index, 3);

    manager.clearBack();
    assertEquals(manager.text, "01 _");
    assertEquals(manager._index, 3);

    manager.clearBack();
    assertEquals(manager.text, "0_ _");
    assertEquals(manager._index, 1);

    manager.clearBack();
    assertEquals(manager.text, "__ _");
    assertEquals(manager._index, 0);

    manager.clearBack();
    assertEquals(manager.text, "__ _");
    assertEquals(manager._index, 0);
})

// Deno.test("masked-input - clearBack", async () => {
//     const manager = new MaskManager("(000) 00 000");
//     assertEquals(manager.text, "(___) __ ___");
//
//     manager.set(0);
//     manager.set(1);
//     manager.set(2);
//     manager.set(3);
//     manager.set(4);
//     manager.set(5);
//     manager.set(6);
//     manager.set(7);
//     manager.set(8);
//     manager.set(9);
//     assertEquals(manager.text, "(012) 34 567");
//     assertEquals(manager._index,11);
//
//     manager.clearBack();
//     assertEquals(manager.text, "(012) 34 56_");
//     assertEquals(manager._index,10);
//
//     manager.clearBack();
//     assertEquals(manager.text, "(012) 34 5__");
//     assertEquals(manager._index,9);
//
//     manager.clearBack();
//     manager.clearBack();
//     assertEquals(manager.text, "(012) 3_ ___");
//     assertEquals(manager._index,6);
//
//     manager.set(9);
//     assertEquals(manager.text, "(012) 39 ___");
//     assertEquals(manager._index,8);
// })