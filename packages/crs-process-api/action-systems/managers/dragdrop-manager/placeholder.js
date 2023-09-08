async function applyPlaceholder(element, options) {
  const bounds = element.getBoundingClientRect();
  element._bounds = bounds;
  const placeholder = await Placeholder[options.drag.placeholderType](element, bounds, options);
  placeholder._bounds = bounds;
  element.style.width = `${bounds.width}px`;
  element.style.height = `${bounds.height}px`;
  element.parentElement.replaceChild(placeholder, element);
  return placeholder;
}
async function createPlaceholderElement(bounds) {
  return await crs.call("dom", "create_element", {
    classes: ["placeholder"],
    styles: {
      width: `${bounds.width}px`,
      height: `${bounds.height}px`
    }
  });
}
class Placeholder {
  static async standard(element, bounds) {
    return await createPlaceholderElement(bounds);
  }
  static async opacity(element, bounds, options) {
    const result = element.cloneNode(true);
    result.style.opacity = options.drag.opacity || "0.5";
    return result;
  }
  static async none(element, bounds, options) {
    return element.cloneNode(true);
  }
}
export {
  applyPlaceholder,
  createPlaceholderElement
};
