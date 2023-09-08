class DebugActions {
  static async perform(step, context, process, item) {
    await this[step.action]?.(step, context, process, item);
  }
  static async start_monitor_events(step, context, process, item) {
    const log = await crs.process.getValue(step.args.log, context, process, item);
    const tagName = await crs.process.getValue((step.args.tag_name || "").toUpperCase(), context, process, item);
    const eventName = await crs.process.getValue(step.args.event_name, context, process, item);
    globalThis.__monitoredEvents = {
      events: [],
      addedCount: 0,
      removedCount: 0
    };
    EventTarget.prototype.addEventListenerBase = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener) {
      this.addEventListenerBase(type, listener);
      if (tagName && this.tagName !== tagName)
        return;
      if (eventName && type !== eventName)
        return;
      const trace = new Error().stack.split("\n");
      if (log === true) {
        console.log("Event added: ", { target: this, type, listener, trace });
      }
      globalThis.__monitoredEvents.addedCount++;
      globalThis.__monitoredEvents.events.push({ target: this, type, listener, trace, path: build_element_path(this) });
    };
    EventTarget.prototype.removeEventListenerBase = EventTarget.prototype.removeEventListener;
    EventTarget.prototype.removeEventListener = function(type, listener) {
      this.removeEventListenerBase(type, listener);
      if (tagName && this.tagName !== tagName)
        return;
      if (eventName && type !== eventName)
        return;
      const trace = new Error().stack.split("\n");
      if (log === true) {
        console.log("Event removed: ", { target: this, type, listener, trace });
      }
      globalThis.__monitoredEvents.removedCount++;
      globalThis.__monitoredEvents.events = globalThis.__monitoredEvents.events.filter((e) => e.target !== this || e.type !== type || e.listener !== listener);
    };
    console.log("Started monitoring events.");
  }
  static async stop_monitor_events(step, context, process, item) {
    if (globalThis.__monitoredEvents === void 0) {
      console.warn("No events are being monitored.");
      return;
    }
    EventTarget.prototype.addEventListener = EventTarget.prototype.addEventListenerBase;
    EventTarget.prototype.removeEventListener = EventTarget.prototype.removeEventListenerBase;
    delete EventTarget.prototype.addEventListenerBase;
    delete EventTarget.prototype.removeEventListenerBase;
    if (globalThis.__monitoredEvents.addedCount > globalThis.__monitoredEvents.removedCount) {
      console.warn(`The number of added events does not match the number of removed events. This may indicate a memory leak. Added: ${globalThis.__monitoredEvents.addedCount}, Removed: ${globalThis.__monitoredEvents.removedCount}`);
    } else {
      console.log(`No event leaks found`);
    }
    const result = globalThis.__monitoredEvents.events.map((e) => {
      return {
        target: [e.target.tagName, e.target.id || ""].join("#"),
        type: e.type,
        path: e.path,
        trace: e.trace
      };
    });
    console.table(globalThis.__monitoredEvents.events);
    globalThis.__monitoredEvents = null;
    delete globalThis.__monitoredEvents;
    return result;
  }
}
function build_element_path(element) {
  if (element instanceof HTMLElement === false)
    return "";
  let path = "";
  while (element) {
    path = element.tagName + (path ? ">" + path : "");
    element = element.parentElement;
  }
  return path;
}
crs.intent.debug = DebugActions;
export {
  DebugActions
};
