import { ensureOptions } from "./dragdrop-manager/options.js";
import { applyPlaceholder } from "./dragdrop-manager/placeholder.js";
import { drop, allowDrop } from "./dragdrop-manager/drop.js";
import { startDrag, updateDrag } from "./dragdrop-manager/drag.js";
import { getDraggable } from "./dragdrop-manager/drag-utils.js";
import { updateMarker } from "./dragdrop-manager/marker.js";
import { startMarker } from "./dragdrop-manager/marker.js";
import { getMouseInputMap, clientX, clientY } from "./input-mapping.js";
class DragDropManager {
  #eventElement;
  #element;
  #target;
  #lastTarget;
  #placeholder;
  #dragElement;
  #marker;
  #options;
  #mouseDownHandler;
  #mouseMoveHandler;
  #mouseUpHandler;
  #startPoint;
  #movePoint;
  #isBusy;
  #updateDragHandler;
  #updateMarkerHandler;
  #boundsCache = [];
  #composedPath;
  #inputMap;
  get element() {
    return this.#element;
  }
  get updateDragHandler() {
    return this.#updateDragHandler;
  }
  get updateMarkerHandler() {
    return this.#updateMarkerHandler;
  }
  get dragElement() {
    return this.#dragElement;
  }
  get movePoint() {
    return this.#movePoint;
  }
  get startPoint() {
    return this.#startPoint;
  }
  get target() {
    return this.#target;
  }
  get marker() {
    return this.#marker;
  }
  get lastTarget() {
    return this.#lastTarget;
  }
  set lastTarget(value) {
    this.#lastTarget = value;
  }
  get boundsCache() {
    return this.#boundsCache;
  }
  get composedPath() {
    return this.#composedPath;
  }
  constructor(element, options) {
    this.#element = element;
    this.#element.style.userSelect = "none";
    this.#options = ensureOptions(options);
    this.#mouseDownHandler = this.#mouseDown.bind(this);
    this.#mouseMoveHandler = this.#mouseMove.bind(this);
    this.#mouseUpHandler = this.#mouseUp.bind(this);
    this.#inputMap = getMouseInputMap();
    this.#eventElement = this.#element.shadowRoot == null ? this.#element : this.#element.shadowRoot;
    this.#eventElement.addEventListener(this.#inputMap["mousedown"], this.#mouseDownHandler, { passive: false });
    this.#element.__dragDropManager = this;
  }
  dispose() {
    this.#eventElement.removeEventListener(this.#inputMap["mousedown"], this.#mouseDownHandler);
    this.#eventElement = null;
    this.#element = null;
    this.#lastTarget = null;
    this.#options = null;
    this.#mouseDownHandler = null;
    this.#mouseMoveHandler = null;
    this.#mouseUpHandler = null;
    this.#startPoint = null;
    this.#movePoint = null;
    this.#placeholder = null;
    this.#dragElement = null;
    this.#isBusy = null;
    this.#updateDragHandler = null;
    this.#updateMarkerHandler = null;
    this.#target = null;
    this.#marker = null;
    this.#composedPath = null;
    this.#boundsCache = null;
    this.#inputMap = null;
  }
  async #mouseDown(event) {
    event.preventDefault();
    this.#composedPath = event.composedPath();
    if (this.#isBusy == true)
      return;
    const x = clientX(event);
    const y = clientY(event);
    this.#startPoint = { x, y };
    this.#movePoint = { x, y };
    const element = getDraggable(event, this.#options);
    if (element == null)
      return;
    this.#element.dataset.dragging = true;
    this.#placeholder = await applyPlaceholder(element, this.#options);
    this.#dragElement = await startDrag(element, this.#options);
    this.#target = this.#placeholder;
    document.addEventListener(this.#inputMap["mousemove"], this.#mouseMoveHandler, { passive: false });
    document.addEventListener(this.#inputMap["mouseup"], this.#mouseUpHandler, { passive: false });
    this.#updateDragHandler = updateDrag.bind(this);
    this.#updateDragHandler();
    this.#marker = await startMarker.call(this, this.#dragElement);
    this.#updateMarkerHandler = updateMarker.bind(this);
    this.#updateMarkerHandler();
  }
  async #mouseMove(event) {
    event.preventDefault();
    this.#composedPath = event.composedPath();
    this.#movePoint.x = clientX(event);
    this.#movePoint.y = clientY(event);
    this.#target = event.target || event.composedPath()[0];
  }
  async #mouseUp(event) {
    this.#isBusy = true;
    event.preventDefault();
    this.#composedPath = event.composedPath();
    this.#updateDragHandler = null;
    this.#updateMarkerHandler = null;
    this.#movePoint = null;
    this.#startPoint = null;
    document.removeEventListener(this.#inputMap["mousemove"], this.#mouseMoveHandler);
    document.removeEventListener(this.#inputMap["mouseup"], this.#mouseUpHandler);
    if (this.#marker) {
      this.#marker.remove();
      this.#marker = null;
    }
    await drop.call(this, this.#dragElement, this.#placeholder, this.#options);
    this.#dragElement = null;
    this.#placeholder = null;
    this.#target = null;
    this.#isBusy = false;
    this.#lastTarget = null;
    for (const element of this.#boundsCache) {
      element._bounds = null;
    }
    this.#boundsCache.length = 0;
    delete this.#options.currentAction;
    this.#composedPath = null;
    delete this.#element.dataset.dragging;
  }
  async validateDropTarget(element) {
    this.#options.currentAction = "hover";
    return allowDrop.call(this, element, this.#options);
  }
}
export {
  DragDropManager
};
