import DrawPolyBase from "./draw-poly-base.js";

export default class DrawPolygon extends DrawPolyBase{

    get shapeKey() {
        return "polygon";
    }
}