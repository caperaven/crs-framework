import {beforeAll, afterAll, afterEach, beforeEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assertThrows, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";

import {GridData} from "../../../../src/managers/grid-data/grid-data.js";

describe("Grid Data Tests", () => {
    it ("constructor", () => {
        const instance = new GridData(10, 20, 30, 40);
        assertEquals(instance.rowCount, 10, "Row count should be 10");
        assertEquals(Object.keys(instance.rowSizes).length, 10, "Row sizes should have 10 items");
        assertEquals(instance.colCount, 30, "Column count should be 30");
        assertEquals(Object.keys(instance.colSizes).length, 30, "Column sizes should have 30 items");
        assertEquals(instance.rowSizes[0], 20, "Row 0 should be 20");
        assertEquals(instance.colSizes[0], 40, "Column 0 should be 40");
    })

    it ("column-groups", () => {
        const instance = new GridData(10, 20, 30, 40);
    });

    it ("setRowHeights", () => {
        const instance = new GridData(20, 20, 30, 40);
        instance.setRowHeights({
            0: 200,
            10: 50
        });

        assertEquals(instance.rowSizes[0], 200, "Row 0 should be 200");
        assertEquals(instance.rowSizes[1], 20, "Row 1 should be 20");
        assertEquals(instance.rowSizes[9], 20, "Row 9 should be 20");
        assertEquals(instance.rowSizes[10], 50, "Row 10 should be 50");
        assertEquals(instance.rowSizes[11], 20, "Row 11 should be 20");
    });

    it ("set invalid row height", () => {
        const instance = new GridData(10, 20, 30, 40);

        const error = assertThrows(() => {
            instance.setRowHeights({
                0: 200,
                9: 50,
                20: 100
            });
        });

        assertEquals(error.message, "Invalid row index: 20");
    });
})