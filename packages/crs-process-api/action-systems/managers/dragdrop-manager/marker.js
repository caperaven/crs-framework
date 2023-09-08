async function startMarker(dragElement) {
  ensureBounds.call(this, dragElement);
  const marker = await crs.call("dom", "create_element", {
    tag_name: "div",
    styles: {
      position: "absolute",
      left: "0",
      top: "0",
      willChange: "transform",
      translate: `${dragElement._bounds.x}px ${dragElement._bounds.y}px`,
      width: `${dragElement._bounds.width}px`
    },
    classes: ["drag-marker"]
  });
  const layer = await crs.call("dom_interactive", "get_animation_layer");
  layer.appendChild(marker);
  return marker;
}
async function updateMarker(now) {
  if (this.updateMarkerHandler == null)
    return;
  const duration = Math.abs(now - (this._lastTime || 0));
  if (duration >= 16) {
    this._lastTime = now;
    performUpdateMarker.call(this).catch((error) => console.error(error));
  }
  requestAnimationFrame(this.updateMarkerHandler);
}
async function performUpdateMarker() {
  const dropIntent = await this.validateDropTarget(this.target);
  const dropTarget = dropIntent?.target;
  if (dropTarget == null)
    return;
  if (dropTarget === this.lastTarget)
    return;
  this.lastTarget = dropTarget;
  if (dropTarget === this.element || dropIntent.position === "append") {
    return addMarkerToContainer.call(this, dropIntent.target);
  }
  ensureBounds.call(this, dropTarget);
  this.marker.style.translate = `${dropTarget._bounds.x}px ${dropTarget._bounds.y}px`;
}
function addMarkerToContainer(target) {
  const container = target || this.element;
  const lastChild = container.lastElementChild;
  let property = "bottom";
  let newTarget = lastChild;
  if (lastChild == null) {
    property = "top";
    newTarget = container;
  }
  ensureBounds.call(this, newTarget);
  this.marker.style.translate = `${newTarget._bounds.x}px ${newTarget._bounds[property]}px`;
}
function ensureBounds(element) {
  if (element._bounds == null) {
    element._bounds = element.getBoundingClientRect();
    this.boundsCache.push(element);
  }
}
export {
  startMarker,
  updateMarker
};
