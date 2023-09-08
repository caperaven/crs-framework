function ensureOptions(options) {
  options = options || {
    drag: {}
  };
  options.drag = ensureDragOptions(options.drag);
  options.drop = ensureDropOptions(options.drop);
  return options;
}
function ensureDragOptions(drag) {
  drag = drag || {};
  drag.query = "[draggable='true']";
  drag.placeholderType = drag.placeholderType || "standard";
  drag.clone = drag.clone || "element";
  return drag;
}
function ensureDropOptions(drop) {
  drop ||= {};
  drop.allowDrop ||= "[aria-dropeffect]";
  drop.action ||= "move";
  return drop;
}
export {
  ensureOptions
};
