import {RegionType} from "../enums/region-type.js";
import {hoverGrouping} from "./hover-grouping.js";
import {hoverHeader} from "./hover-header.js";
import {hoverCells} from "./hover-cells.js";

const HoverLT = Object.freeze({
    [RegionType.GROUPING] : hoverGrouping,
    [RegionType.HEADER]   : hoverHeader,
    [RegionType.CELLS]    : hoverCells
})

export function hover(parentElement, x, y, def, pageDetails) {
    let region = RegionType.CELLS;
    if (y < def.regions.grouping?.bottom) {
        region = RegionType.GROUPING;
    }
    else if (y < def.regions.header.bottom) {
        region = RegionType.HEADER;
    }

    HoverLT[region](parentElement, x, y, def, pageDetails);
}