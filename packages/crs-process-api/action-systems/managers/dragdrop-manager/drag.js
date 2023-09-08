async function startDrag(dragElement, options) {
  const layer = await crs.call("dom_interactive", "get_animation_layer");
  const element = await DragClone[options.drag.clone](dragElement, options);
  element.style.translate = `${dragElement._bounds.x}px ${dragElement._bounds.y}px`;
  element.style.filter = "drop-shadow(0 0 5px #00000080)";
  layer.appendChild(element);
  return element;
}
class DragClone {
  static async element(dragElement) {
    return dragElement;
  }
  static async template(dragElement, options) {
    let template = options.drag.template;
    if (template == null) {
      template = document.querySelector(`#${dragElement.dataset.template}`);
    }
    const result = template.content.cloneNode(true).children[0];
    result._bounds = dragElement._bounds;
    result.dragElement = dragElement;
    return result;
  }
}
async function updateDrag(frameTime) {
  if (this.updateDragHandler == null)
    return;
  const x = this.dragElement._bounds.x + (this.movePoint.x - this.startPoint.x);
  const y = this.dragElement._bounds.y + (this.movePoint.y - this.startPoint.y);
  this.dragElement.style.translate = `${x}px ${y}px`;
  requestAnimationFrame(this.updateDragHandler);
}
export {
  startDrag,
  updateDrag
};
