import {DataPipeline} from "./../../../../src/managers/data-pipeline/data-pipeline.js";
import { assertEquals, assertExists, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";

Deno.test("DataPipeline - simple activate", () => {
    let called = false;
    const pipeline = new DataPipeline();
    pipeline.addIntent(() => called = true);
    pipeline.addPropertySlot("name");
    pipeline.setPropertyValue("name", "test");

    assertEquals(called, false);
    pipeline.activate();
    assertEquals(called, true);
})

Deno.test("DataPipeline - simple null sequence checks for callbacks", () => {
    let called = false;
    const pipeline = new DataPipeline();
    pipeline.addIntent(() => called = true);
    pipeline.addPropertySlot("firstName");
    pipeline.addPropertySlot("lastName");
    pipeline.activate();

    assertEquals(called, false);
    pipeline.setPropertyValue("firstName", "test");
    assertEquals(called, false);
    pipeline.setPropertyValue("lastName", "test");
    assertEquals(called, true);
})