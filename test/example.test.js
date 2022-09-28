import { assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import { afterEach, beforeEach, describe, it} from "https://deno.land/std@0.149.0/testing/bdd.ts";

import init, {parse} from "./bin/html_parser.js"

await init();

describe("test", async () => {
    let instance;

    beforeEach(() => {
    })

    afterEach(() => {
    })

    it("my-class - constructed", async () => {
        const result = parse(`
            <!doctype html>
            <html lang="en">
                <head>
                    <meta charset="utf-8">
                    <title>Html parser</title>
                </head>
                <body>
                    <h1 id="a" class="b c">Hello world</h1>
                    </h1> <!-- comments & dangling elements are ignored -->
                </body>
            </html>        
        `);

        console.log(result);
    })
})