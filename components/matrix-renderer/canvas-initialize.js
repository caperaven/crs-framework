export function initialize(parentElement, width, height) {
    parentElement.host.style.setProperty("--width", `${width}px`);
    parentElement.host.style.setProperty("--height", `${height}px`);
    return createCanvas(parentElement, width, height);
}

function createCanvas(parent, width, height) {
    const canvas = parent.querySelector("canvas");
    parent.appendChild(canvas);

    const dpr = window.devicePixelRatio;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    return ctx;
}