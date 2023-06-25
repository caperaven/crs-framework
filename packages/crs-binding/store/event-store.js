class EventStore {
  #store = {};
  #eventHandler = this.#onEvent.bind(this);
  get store() {
    return this.#store;
  }
  async #onEvent(event2) {
    const targets = getTargets(event2);
    if (targets.length === 0)
      return;
    for (const target of targets) {
      const uuid = target["__uuid"];
      const data = this.#store[event2.type];
      const intent = data[uuid];
      if (intent != null) {
        const bid = target["__bid"];
        if (Array.isArray(intent)) {
          for (const i of intent) {
            await this.#onEventExecute(i, bid, target);
          }
          continue;
        }
        await this.#onEventExecute(intent, bid, target);
      }
    }
  }
  async #onEventExecute(intent, bid, target) {
    let provider = intent.provider;
    provider = provider.replaceAll("\\", "");
    const providerInstance = crs.binding.providers.attrProviders[provider];
    await providerInstance.onEvent?.(event, bid, intent, target);
  }
  getIntent(event2, uuid) {
    return this.#store[event2]?.[uuid];
  }
  register(event2, uuid, intent, isCollection = true) {
    if (this.#store[event2] == null) {
      document.addEventListener(event2, this.#eventHandler, {
        capture: true,
        passive: true
      });
      this.#store[event2] = {};
    }
    if (isCollection) {
      this.#store[event2][uuid] ||= [];
      this.#store[event2][uuid].push(intent);
      return;
    }
    this.#store[event2][uuid] = intent;
  }
  clear(uuid) {
    const element = crs.binding.elements[uuid];
    if (element?.__events == null)
      return;
    const events = element.__events;
    for (const event2 of events) {
      delete this.#store[event2][uuid];
    }
  }
}
function getTargets(event2) {
  return event2.composedPath().filter((element) => element["__uuid"] != null);
}
export {
  EventStore
};
