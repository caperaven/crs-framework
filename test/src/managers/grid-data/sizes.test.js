import { describe, it } from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.149.0/testing/asserts.ts";

import {Sizes} from "../../../../src/managers/grid-data/sizes.js";

describe("Grid Data Tests", () => {
    it("constructor", () => {
        let finder = new Sizes(3, 10).setSizes({
            1: 20,
            2: 30
        })

        assertEquals(finder.length, 3);
        assertEquals(finder.at(0), 10);
        assertEquals(finder.at(1), 20);
        assertEquals(finder.at(2), 30);

        assertEquals(finder.acculative(0), 10);
        assertEquals(finder.acculative(1), 30);
        assertEquals(finder.acculative(2), 60);

        assertEquals(finder.getIndex(0), 0);
        assertEquals(finder.getIndex(10), 0);
        assertEquals(finder.getIndex(11), 1);
        assertEquals(finder.getIndex(30), 1);
        assertEquals(finder.getIndex(31), 2);
        assertEquals(finder.getIndex(60), 2);

        assertEquals(finder.totalSize, 60);
    })

    it ("set", () => {
        let finder = new Sizes(3, 10);
        finder.set(0, 100);

        assertEquals(finder.at(0), 100);
        assertEquals(finder.totalSize, 120);
    })

    it ("performance", () => {
        const finderStart = performance.now();
        let finder = new Sizes(100000, 10);
        const finderEnd = performance.now();
        console.log(`Finder created in ${finderEnd - finderStart}ms`);

        const start = performance.now();
        finder.getIndex(50000);
        const end = performance.now();

        console.log(`Time taken: ${end - start}ms`);
    })
});