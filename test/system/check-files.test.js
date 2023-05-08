import { describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import * as path from "https://deno.land/std/path/mod.ts";

import {checkSource} from "./../../packages/crs-process-api/tools/checksource.js";

describe("checksource tests", async () => {
    it("checkSource", async () => {
        const testFilePath = Deno.mainModule;
        const testDir = path.dirname(testFilePath);
        const folder = path.fromFileUrl(testDir.replace("test/system", ""));

        const result = await checkSource(folder, ["app"], ["text-editor\\editor.js"]);

        if (result.length > 0) {
            console.error(result);
        }

        assertEquals(result.length, 0);
    })
})

