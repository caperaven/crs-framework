class FixedPositionActions {
  static async perform(step, context, process, item) {
    await this[step.action]?.(step, context, process, item);
  }
  static async set(step, context, process, item) {
    const element = await crs.dom.get_element(step.args.element, context, process, item);
    const position = await crs.process.getValue(step.args.position, context, process, item);
    const margin = await crs.process.getValue(step.args.margin || 0, context, process, item);
    element.style.position = "fixed";
    element.style.left = 0;
    element.style.top = 0;
    const elementBounds = element.getBoundingClientRect();
    Positioning[position](element, margin, elementBounds);
  }
}
class Positioning {
  static "top-left"(element, margin) {
    margin = Math.round(margin);
    element.style.translate = `${margin}px ${margin}px`;
  }
  static "top-center"(element, margin, elementBounds) {
    const x = Math.round(window.innerWidth / 2 - elementBounds.width / 2);
    const y = Math.round(margin);
    element.style.translate = `${x}px ${y}px`;
  }
  static "top-right"(element, margin, elementBounds) {
    const x = Math.round(window.innerWidth - elementBounds.width - margin);
    const y = Math.round(margin);
    element.style.translate = `${x}px ${y}px`;
  }
  static "bottom-left"(element, margin, elementBounds) {
    const x = Math.round(margin);
    const y = Math.round(window.innerHeight - elementBounds.height - margin);
    element.style.translate = `${x}px ${y}px`;
  }
  static "bottom-center"(element, margin, elementBounds) {
    const x = Math.round(window.innerWidth / 2 - elementBounds.width / 2);
    const y = Math.round(window.innerHeight - elementBounds.height - margin);
    element.style.translate = `${x}px ${y}px`;
  }
  static "bottom-right"(element, margin, elementBounds) {
    const x = Math.round(window.innerWidth - elementBounds.width - margin);
    const y = Math.round(window.innerHeight - elementBounds.height - margin);
    element.style.translate = `${x}px ${y}px`;
  }
  static "center-screen"(element, margin, elementBounds) {
    const x = Math.round(window.innerWidth / 2 - elementBounds.width / 2);
    const y = Math.round(window.innerHeight / 2 - elementBounds.height / 2);
    element.style.translate = `${x}px ${y}px`;
  }
}
crs.intent.fixed_position = FixedPositionActions;
export {
  FixedPositionActions
};
