export function initialize(parent, width, height) {
    const ctx = createCanvas(parent, width, height);
    createScroller(parent, width, height);
    return ctx;
}

function createCanvas(parent, width, height) {
    const canvas = document.createElement("canvas")
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // avoid half pixels by explicitly setting the position
    // once you do that the element
    canvas.style.position = "absolute";
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.style.imageRendering = "pixelated";
    parent.appendChild(canvas);

    const dpr = window.devicePixelRatio;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    return ctx;
}

function createScroller(parent, width, height) {
    const scroller = document.createElement("div");
    scroller.id = "scroller";
    scroller.style.width = `${width}px`;
    scroller.style.height = `${height}px`;
    scroller.style.position = "absolute";
    scroller.style.top = "0px";
    scroller.style.left = "0px";
    scroller.style.overflow = "auto";
    scroller.style.willChange = "transform";

    createMarker(scroller);

    parent.appendChild(scroller);
}

function createMarker(parent) {
    const marker = document.createElement("div");
    marker.id = "marker";
    marker.style.width = "1px";
    marker.style.height = "1px";
    marker.style.position = "absolute";
    marker.style.translate = "0px 0px";
    parent.appendChild(marker);
}