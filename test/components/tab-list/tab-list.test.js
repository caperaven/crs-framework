import { beforeAll, beforeEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";

await init();

// beforeAll(async () => {
//     await import("../../../components/tab-list/tab-list.js");
// })
//
// describe ("text-editor", async () => {
//     let instance;
//     let perspective;
//
//     beforeEach(async () => {
//         instance = document.createElement("tab-list");
//         await instance.connectedCallback();
//     })
// })