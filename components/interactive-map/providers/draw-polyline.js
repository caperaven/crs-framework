import DrawPolyBase from "./draw-poly-base.js";

export default class DrawPolyline extends DrawPolyBase{

    get shapeKey() {
        return "polyline";
    }

    get minPoints() {
        return 2;
    }

    get closeShape() {
        return false;
    }
}