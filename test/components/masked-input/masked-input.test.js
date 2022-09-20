import {initRequired} from "./../../mockups/init-required.js";

import { assertEquals } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import { MaskManager } from "./../../../components/maked-input/masked-input.js";

await initRequired();

Deno.test("masked-input - set mask text", async () => {
    const manager = new MaskManager("(000) 00 000");
    assertEquals(manager.text, "(___) __ ___");
})