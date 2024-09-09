import { describe, it } from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.149.0/testing/asserts.ts";

import {SizesManager} from "../../../../src/managers/grid-data-managers/sizes-manager.js";

describe("Grid Data Tests", () => {
    it("constructor", () => {
        const sizes = new SizesManager(3, 10).setSizes({
            1: 20,
            2: 30
        })

        assertEquals(sizes.length, 3);
        assertEquals(sizes.at(0), 10);
        assertEquals(sizes.at(1), 20);
        assertEquals(sizes.at(2), 30);

        assertEquals(sizes.cumulative(0), 10);
        assertEquals(sizes.cumulative(1), 30);
        assertEquals(sizes.cumulative(2), 60);

        assertEquals(sizes.getIndex(0), 0);
        assertEquals(sizes.getIndex(10), 0);
        assertEquals(sizes.getIndex(11), 1);
        assertEquals(sizes.getIndex(30), 1);
        assertEquals(sizes.getIndex(31), 2);
        assertEquals(sizes.getIndex(60), 2);

        assertEquals(sizes.totalSize, 60);
    })

    it ("constructor - sizes", () => {
        const sizes = new SizesManager(3, 0, [20, 30, 40]);
        assertEquals(sizes.at(0), 20);
        assertEquals(sizes.at(1), 30);
        assertEquals(sizes.at(2), 40);
        assertEquals(sizes.cumulative(0), 20);
        assertEquals(sizes.cumulative(1), 50);
        assertEquals(sizes.cumulative(2), 90);
    })

    it ("set", () => {
        const sizes = new SizesManager(3, 10);
        sizes.set(0, 100);

        assertEquals(sizes.at(0), 100);
        assertEquals(sizes.totalSize, 120);
    })

    it ("getVisibleRange", () => {
        const finder = new SizesManager(100, 10);

        const range = finder.getVisibleRange(0, 50);
        assertEquals(range.start, 0);
        assertEquals(range.end, 4);

        const range2 = finder.getVisibleRange(50, 50);
        assertEquals(range2.start, 4);
        assertEquals(range2.end, 9);
    });

    it ("performance", () => {
        const finderStart = performance.now();
        const finder = new SizesManager(100000, 10);
        const finderEnd = performance.now();
        console.log(`Finder created in ${finderEnd - finderStart}ms`);

        const start = performance.now();
        finder.getIndex(50000);
        const end = performance.now();

        console.log(`Time taken: ${end - start}ms`);
    })
});