import {createMarker} from "./marker.js";

export function canvasInit(parent, width, height, gridData) {
    const canvas = parent.querySelector("canvas");
    const scroller = parent.querySelector(".scroller");
    createMarker(scroller, gridData, width, height);

    scroller.style.width = `${width}px`;
    scroller.style.height = `${height}px`;

    const dpr = window.devicePixelRatio;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d", {alpha: false});
    ctx.scale(dpr, dpr);
    return ctx;
}



