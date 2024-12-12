/**
 * @enum Positions - Enum for possible positions.
 * @readonly
 * @enum {string}
 */
export const Positions = Object.freeze({
    RIGHT: "right",
    LEFT: "left",
    TOP: "top",
    BOTTOM: "bottom",
    MIDDLE: "middle",
    NONE: "none"
});

/**
 * @enum Operations - Enum for possible operations.
 * @readonly
 * @enum {string}
 */
export const Operations = Object.freeze({
    DIVISION: "division",
    ADDITION: "addition"
});

/**
 * standardPositioning - Standard positioning offsets.
 * @readonly
 * @enum {Object}
 */
export const standardPositioning = Object.freeze({
    left: {offset: 10},
    right: {offset: -22},
    yOffsets: {
        top: -15,
        bottom: -4
    }
});

/**
 * noneStandardPositioning - Non-standard positioning offsets.
 * @readonly
 * @enum {Object}
 */
export const noneStandardPositioning = Object.freeze({
    none: {offset: 0},
    bottom: {offset: -15},
    top: {offset: -15},
    yOffset: {
        bottom: -20,
        top: 10
    },
    xOffset: 21
});

/**
 * operatorActions - Operator actions for calculating coordinates.
 * @readonly
 * @enum {Function}
 */
export const operatorActions = {
    'division': async (xCoordinate,width) =>  (xCoordinate + width / 2),
    'addition': async (xCoordinate,width,type) => {
        return xCoordinate + width + (standardPositioning[type]?.offset ?? noneStandardPositioning[type].offset);
    }
};

/**
 * @function calculatePosition - Calculate the position based on the given parameters.
 * @param {Object} positionInfo - The position information.
 * @param {string} anchor - The anchor position.
 * @param {string} position - The position type.
 * @param {number} [margin=0] - The margin for the target.
 * @param {string} [positionType="calculateStandardPositioning"] - The type of positioning calculation.
 * @returns {Promise<Object>} The calculated coordinates.
 */
export async function calculatePosition(positionInfo, anchor, position, margin= 0, positionType = true) {
    if (positionType === true) {
        return await calculateStandardPositioning(positionInfo, anchor, position, margin);
    }

    return await calculateNoneStandardPositioning(positionInfo, anchor, position);
}

/**
 * @function calculateStandardPositioning - Calculate standard positioning coordinates.
 * @param {Object} positionInfo - The position information.
 * @param {string} anchor - The anchor position.
 * @param {string} position - The position type.
 * @param {number} margin - The margin for the target.
 * @returns {Promise<Object>} The calculated coordinates.
 */
async function calculateStandardPositioning(positionInfo, anchor, position, margin) {
    const operator = anchor === Positions.MIDDLE ? Operations.DIVISION : Operations.ADDITION;
    const width = anchor === Positions.RIGHT || anchor === Positions.MIDDLE ? positionInfo.width: 0;
    const marginOffset = position === "bottom" ? margin : 0;

    const xCoordinate = Math.round(await operatorActions[operator](positionInfo.x , width, anchor));
    const yCoordinate = Math.round(positionInfo[position] + standardPositioning.yOffsets[position]) + marginOffset;
    return {xCoordinate, yCoordinate}
}

/**
 * @function calculateNoneStandardPositioning - Calculate non-standard positioning coordinates.
 * @param {Object} positionInfo - The position information.
 * @param {string} anchor - The anchor position.
 * @param {string} position - The position type.
 * @returns {Promise<Object>} The calculated coordinates.
 */
async function calculateNoneStandardPositioning(positionInfo, anchor, position) {
    const operator = anchor === Positions.MIDDLE ? Operations.DIVISION : Operations.ADDITION;
    const xPosition = position === Positions.LEFT ? positionInfo.x : positionInfo.right;
    const height = anchor === Positions.MIDDLE ? positionInfo.height : 0;
    const width = position === Positions.RIGHT ? noneStandardPositioning.xOffset : 0;


    let xCoordinate,yCoordinate;
    if (anchor === Positions.MIDDLE) {
        xCoordinate = Math.round(await operatorActions[Operations.ADDITION](xPosition, width, Positions.TOP));
        yCoordinate = Math.round(await operatorActions[operator](positionInfo.top, height, Positions.NONE));
    }else {
        xCoordinate = Math.round(await operatorActions[operator](xPosition, width, anchor));
        yCoordinate = Math.round(positionInfo[anchor] + noneStandardPositioning.yOffset[anchor]);
    }

    return {xCoordinate, yCoordinate}
}