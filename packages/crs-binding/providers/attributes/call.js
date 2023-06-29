import { parseEvent } from "./utils/parse-event.js";
import { getQueries } from "./utils/get-queries.js";
class CallProvider {
  async onEvent(event, bid, intent) {
    await execute(bid, intent, event);
  }
  async parse(attr) {
    parseEvent(attr, this.getIntent);
  }
  getIntent(attrValue) {
    const result = { provider: ".call", value: attrValue };
    getQueries(attrValue, result);
    return result;
  }
  async clear(uuid) {
    crs.binding.eventStore.clear(uuid);
  }
}
async function execute(bid, intent, event) {
  const context = crs.binding.data.getContext(bid);
  if (context == null)
    return;
  const parts = intent.value.replace(")", "").split("(");
  const fn = parts[0];
  const args = parts.length == 1 ? [event] : processArgs(parts[1], event);
  if (intent.queries != null) {
    let parent;
    if (context instanceof crs.classes.BindableElement) {
      parent = context.shadowRoot || context;
    } else if (context.element != null) {
      parent = context.element.shadowRoot || context.element;
    } else {
      parent = document;
    }
    for (let query of intent.queries) {
      const element = parent.querySelector(query);
      await element[fn].call(element, ...args);
    }
    return;
  }
  await context[fn].call(context, ...args);
}
function processArgs(expr, event) {
  const args = [];
  const parts = expr.split(",");
  for (let part of parts) {
    part = part.trim();
    if (part === "$event") {
      args.push(event);
    } else if (Number.isNaN(part) == true) {
      args.push(Number(part));
    } else if (part.indexOf("'") == 0) {
      args.push(part.replaceAll("'", ""));
    } else {
      args.push(part);
    }
  }
  return args;
}
export {
  CallProvider as default
};
