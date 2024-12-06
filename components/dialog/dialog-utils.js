const Positions = Object.freeze({
    RIGHT: "right",
    LEFT: "left",
    TOP: "top",
    BOTTOM: "bottom",
    MIDDLE: "middle",
    NONE: "none"
});

const Operations = Object.freeze({
    DIVISION: "division",
    ADDITION: "addition"
});
const standardPositioning = Object.freeze({
    left: {offset: 10},
    right: {offset: -20}
});
const noneStandardPositioning = Object.freeze({
    none: {offset: 0},
    bottom: {offset: -10},
    top: {offset: -10},
});
const operatorActions = {
    'division': async (xCoordinate,width) =>  (xCoordinate + width / 2),
    'addition': async (xCoordinate,width,type) => {
        return xCoordinate + width + (standardPositioning[type]?.offset ?? noneStandardPositioning[type].offset);
    }
};


export async function calculatePosition(positionInfo, anchor, position, positionType = "standardPositioning") {
    if (positionType === "standardPositioning") {
        return await calculateStandardPositioning(positionInfo, anchor, position);
    }

    return await calculateNoneStandardPositioning(positionInfo, anchor, position);
}

async function calculateStandardPositioning(positionInfo, anchor, position) {
    const operator = anchor === Positions.MIDDLE ?  Operations.DIVISION : Operations.ADDITION;
    const width = anchor === Positions.RIGHT || anchor === Positions.MIDDLE ? positionInfo.width : 0;

    const xCoordinate = Math.round(await operatorActions[operator](positionInfo.x , width, anchor));
    const yCoordinate = Math.round(positionInfo[position]);
    return {xCoordinate, yCoordinate}
}

async function calculateNoneStandardPositioning(positionInfo, anchor, position) {
    const operator = anchor === Positions.MIDDLE ? Operations.DIVISION : Operations.ADDITION;
    const xPosition = position === Positions.LEFT ? positionInfo.x : positionInfo.right;
    const height = anchor === Positions.MIDDLE ? positionInfo.height : 0;

    let xCoordinate,yCoordinate;
    if (anchor === Positions.MIDDLE) {
        xCoordinate = Math.round(await operatorActions[Operations.ADDITION](xPosition, 0, Positions.TOP));
        yCoordinate = Math.round(await operatorActions[operator](positionInfo.top, height, Positions.NONE));
    }else {
        const offset =  anchor === Positions.BOTTOM ? noneStandardPositioning[anchor].offset : 0;
        xCoordinate = Math.round(await operatorActions[operator](xPosition, 0, anchor));
        yCoordinate = Math.round(positionInfo[anchor] + offset);
    }

    return {xCoordinate, yCoordinate}
}