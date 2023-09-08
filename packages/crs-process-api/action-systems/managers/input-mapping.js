function getMouseInputMap() {
  const map = {
    "mousedown": "mousedown",
    "mousemove": "mousemove",
    "mouseup": "mouseup"
  };
  if (globalThis.isMobile) {
    map["mousedown"] = "touchstart";
    map["mousemove"] = "touchmove";
    map["mouseup"] = "touchend";
  }
  return map;
}
function clientX(event) {
  let x = event.clientX;
  if (x == null) {
    x = event.touches?.[0]?.pageX;
  }
  if (x == null) {
    x = event.changedTouches?.[0]?.pageX;
  }
  return x;
}
function clientY(event) {
  let y = event.clientY;
  if (y == null) {
    y = event.touches?.[0]?.pageY;
  }
  if (y == null) {
    y = event.changedTouches?.[0]?.pageY;
  }
  return y;
}
export {
  clientX,
  clientY,
  getMouseInputMap
};
