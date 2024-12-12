import {assertEquals, describe, it} from "./../../dependencies.js";
import { calculatePosition, Positions, Operations, standardPositioning, noneStandardPositioning, operatorActions } from "../../../components/dialog/dialog-utils.js";

describe("Dialog utils", () => {
    it("Positions enum should have correct values", () => {
        assertEquals(Positions.RIGHT, "right");
        assertEquals(Positions.LEFT, "left");
        assertEquals(Positions.TOP, "top");
        assertEquals(Positions.BOTTOM, "bottom");
        assertEquals(Positions.MIDDLE, "middle");
        assertEquals(Positions.NONE, "none");
    });

    it("Operations enum should have correct values", () => {
        assertEquals(Operations.DIVISION, "division");
        assertEquals(Operations.ADDITION, "addition");
    });

    it("standardPositioning should have correct values", () => {
        assertEquals(standardPositioning.left.offset, 10);
        assertEquals(standardPositioning.right.offset, -22);
        assertEquals(standardPositioning.yOffsets.top, -15);
        assertEquals(standardPositioning.yOffsets.bottom, -4);
    });

    it("noneStandardPositioning should have correct values", () => {
        assertEquals(noneStandardPositioning.none.offset, 0);
        assertEquals(noneStandardPositioning.bottom.offset, -15);
        assertEquals(noneStandardPositioning.top.offset, -15);
        assertEquals(noneStandardPositioning.yOffset.bottom, -20);
        assertEquals(noneStandardPositioning.yOffset.top, 10);
        assertEquals(noneStandardPositioning.xOffset, 21);
    });

    it("operatorActions should perform correct calculations", async () => {
        assertEquals(await operatorActions.division(10, 20), 20);
        assertEquals(await operatorActions.addition(10, 20, "left"), 40);
        assertEquals(await operatorActions.addition(10, 20, "right"), 8);
    });

    it("calculatePosition should calculate standard positioning correctly", async () => {
        const positionInfo = { x: 10, width: 20, top: 30, bottom: 40 };
        const result = await calculatePosition(positionInfo, Positions.RIGHT, "top", 5, true);
        assertEquals(result, { xCoordinate: 8, yCoordinate: 15 });
    });

    it("calculatePosition should calculate non-standard positioning correctly", async () => {
        const positionInfo = { x: 10, right: 20, top: 30, bottom: 40, height: 50 };
        const result = await calculatePosition(positionInfo, Positions.LEFT, "bottom", 0, false);
        assertEquals(result, { xCoordinate: 31, yCoordinate: 20 });
    });
});