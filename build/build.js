import {bundleJs, copyDirectory, packageFolder} from "./package.js";
import {ensureDir} from "https://deno.land/std@0.149.0/fs/ensure_dir.ts";
import {emptyDir} from "https://deno.land/std@0.149.0/fs/empty_dir.ts";
import * as path from "https://deno.land/std/path/mod.ts";

async function createFolderStructure() {
    await ensureDir("./dist");
    await emptyDir("./dist");

    await ensureDir("./dist/build");
    await ensureDir("./dist/components");
    await ensureDir("./dist/src");
    await ensureDir("./dist/test");
    await ensureDir("./dist/test/mockups");
}

await createFolderStructure();
await copyDirectory("./test/mockups", "./dist/test/mockups");
await copyDirectory("./packages/crs-binding", "./dist/packages/crs-binding");
await copyDirectory("./packages/crs-modules", "./dist/packages/crs-modules");
await copyDirectory("./packages/crs-process-api", "./dist/packages/crs-process-api");
await copyDirectory("./packages/crs-router", "./dist/packages/crs-router");
await copyDirectory("./packages/crs-schema", "./dist/packages/crs-schema");
await copyDirectory("./documents", "./dist/documents");
await packageFolder("./components", "./dist/components", true);
await packageFolder("./src", "./dist/src", true);

Deno.copyFile("./build/package.js", "./dist/build/package.js");

Deno.exit(0);