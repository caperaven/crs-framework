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
})