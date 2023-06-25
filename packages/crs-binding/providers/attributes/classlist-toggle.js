class ClassListToggleProvider {
  async onEvent(event, bid, intent, target) {
    const element = intent.query == "this" ? target : target.getRootNode().querySelector(intent.query);
    const className = intent.className.replaceAll("'", "");
    element.classList.toggle(className);
  }
  async parse(attr, context) {
    const element = attr.ownerElement;
    const nameParts = attr.name.split(".");
    const event = nameParts[0];
    crs.binding.utils.markElement(element, context);
    const uuid = element["__uuid"];
    const valueParts = attr.value.replace(")", "").split("(");
    const query = valueParts[0];
    const className = valueParts[1];
    const intent = {
      provider: "classlist.toggle",
      query,
      className
    };
    crs.binding.eventStore.register(event, uuid, intent);
    element.__events ||= [];
    element.__events.push(event);
  }
  async clear(uuid) {
    crs.binding.eventStore.clear(uuid);
  }
}
export {
  ClassListToggleProvider as default
};
