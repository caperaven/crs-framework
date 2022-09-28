import {copyDirectory, packageFolder} from "./package.js";
import {ensureDir} from "https://deno.land/std@0.149.0/fs/ensure_dir.ts";
import {emptyDir} from "https://deno.land/std@0.149.0/fs/empty_dir.ts";

async function createFolderStructure() {
    await ensureDir("./dist");
    await emptyDir("./dist");

    await ensureDir("./dist/build");
    await ensureDir("./dist/components");
    await ensureDir("./dist/src");
    await ensureDir("./dist/test");
}

await createFolderStructure();
await copyDirectory("./packages/crs-binding", "./dist/crs-binding");
await copyDirectory("./packages/crs-modules", "./dist/crs-modules");
await copyDirectory("./packages/crs-process-api", "./dist/crs-process-api");
await copyDirectory("./packages/crs-router", "./dist/crs-router");
await copyDirectory("./packages/crs-schema", "./dist/crs-schema");
await copyDirectory("./documents", "./dist/documents");
await copyDirectory("./test/mockups", "./dist/test/mockups");
await packageFolder("./components", "./dist/components", true);
await packageFolder("./src", "./dist/src", true);

await Deno.copyFile(`./build/package.js`, `./dist/build/package.js`);

Deno.exit(0);