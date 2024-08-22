import {beforeAll, afterAll, afterEach, beforeEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assertThrows, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";

import {GridData} from "../../../../src/managers/grid-data/grid-data.js";

describe("Grid Data Tests", () => {
    it ("constructor", () => {
        const instance = new GridData(10, 20, 30, 40);
        assertEquals(instance.rowCount, 10, "Row count should be 10");
        assertEquals(instance.colCount, 30, "Column count should be 30");
    })

    it ("column-groups", () => {
        const instance = new GridData(10, 20, 30, 40);
        const groups = {
            "Group 1": {start: 2, end: 3},
            "Group 2": {start: 4, end: 6},
            "Group 3": {start: 7}
        }

        instance.setColumnGroups(groups);
        assertEquals(instance.groups, groups, "Groups should be set");
    });

    it ("setRowHeights", () => {
        const instance = new GridData(20, 20, 30, 40);
        instance.setRowHeights({
            0: 200,
            10: 50
        });

        assertEquals(instance.rowSizes.at(0), 200, "Row 0 should be 200");
        assertEquals(instance.rowSizes.at(1), 20, "Row 1 should be 20");
        assertEquals(instance.rowSizes.at(9), 20, "Row 9 should be 20");
        assertEquals(instance.rowSizes.at(10), 50, "Row 10 should be 50");
        assertEquals(instance.rowSizes.at(11), 20, "Row 11 should be 20");
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

        assertEquals(error.message, "Invalid index: 20");
    });

    it ("set column widths", () => {
        const instance = new GridData(10, 20, 30, 40);
        instance.setColumnWidths({
            0: 200,
            10: 50
        });

        assertEquals(instance.colSizes.at(0), 200, "Column 0 should be 200");
        assertEquals(instance.colSizes.at(1), 40, "Column 1 should be 40");
        assertEquals(instance.colSizes.at(9), 40, "Column 9 should be 40");
        assertEquals(instance.colSizes.at(10), 50, "Column 10 should be 50");
        assertEquals(instance.colSizes.at(11), 40, "Column 11 should be 40");
    })

    it ("getScrollMarkerVector", () => {
        const instance = new GridData(10, 20, 30, 10);

        const vector = instance.getScrollMarkerVector();
        assertEquals(vector.x, 300, "X should be 200");
        assertEquals(vector.y, 200, "Y should be 300");
    })
})