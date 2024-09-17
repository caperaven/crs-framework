import {RegionType} from "../enums/region-type.js";
import {hoverGrouping} from "./hover-grouping.js";
import {hoverHeader} from "./hover-header.js";
import {hoverCells} from "./hover-cells.js";

const HoverLT = Object.freeze({
    [RegionType.GROUPING] : hoverGrouping,
    [RegionType.HEADER]   : hoverHeader,
    [RegionType.CELLS]    : hoverCells
})

export function hover(ctx, parentElement, details) {
    let region = RegionType.CELLS;
    if (details.offsetY < details.def.regions.grouping?.bottom) {
        region = RegionType.GROUPING;
    }
    else if (details.offsetY < details.def.regions.header.bottom) {
        region = RegionType.HEADER;
    }

    HoverLT[region](ctx, parentElement, details);
}