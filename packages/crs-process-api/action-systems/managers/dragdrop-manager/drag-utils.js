function getDraggable(event, options) {
  const dragQuery = options.drag?.query || "[draggable='true']";
  const cp = event.composedPath();
  const target = cp[0];
  if (target.matches(dragQuery)) {
    if (options.drag.cpIndex != null) {
      return cp[options.drag.cpIndex];
    }
    return target;
  }
  if (target.parentElement?.matches(dragQuery)) {
    return target.parentElement;
  }
  return null;
}
export {
  getDraggable
};
