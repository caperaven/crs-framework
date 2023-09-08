class DomObserverActions {
  static async perform(step, context, process, item) {
    await this[step.action]?.(step, context, process, item);
  }
  static async observe_resize(step, context, process, item) {
    const element = await crs.dom.get_element(step.args.element, context, process, item);
    const callback = await crs.process.getValue(step.args.callback, context, process, item);
    element.__resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        callback(entry);
      }
    });
    element.__resizeObserver.observe(element);
  }
  static async unobserve_resize(step, context, process, item) {
    const element = await crs.dom.get_element(step.args.element, context, process, item);
    element.__resizeObserver.disconnect();
    delete element.__resizeObserver;
  }
}
crs.intent.dom_observer = DomObserverActions;
export {
  DomObserverActions
};
