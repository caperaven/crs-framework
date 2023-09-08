class RouteManager {
  #routes;
  #definition;
  #callback;
  #routeDefinition;
  #updatingRoute = false;
  #onpopstateChangedHandler = this.#onpopstate.bind(this);
  get definition() {
    return this.#definition;
  }
  get routeDefinition() {
    return Object.freeze(this.#routeDefinition);
  }
  constructor(routes, definition, callback) {
    this.#routes = routes;
    this.#definition = definition;
    this.#callback = callback;
    this.goto(window.location.href).then(() => {
      addEventListener("popstate", this.#onpopstateChangedHandler);
    });
  }
  dispose() {
    removeEventListener("popstate", this.#onpopstateChangedHandler);
    this.#routes = null;
    this.#definition = null;
    this.#callback = null;
    this.#routeDefinition = null;
    this.#onpopstateChangedHandler = null;
    this.#updatingRoute = null;
  }
  async #onpopstate(event) {
    event.preventDefault();
    this.#routeDefinition = await crs.call("route", "parse", { url: window.location.href });
    await this.#callback?.(this.#routeDefinition);
  }
  async goto(routeDefinition) {
    if (typeof routeDefinition === "string") {
      routeDefinition = await crs.call("route", "parse", { url: routeDefinition });
    }
    this.#routeDefinition = routeDefinition;
    const url = await crs.call("route", "create_url", { definition: this.#routeDefinition });
    history.pushState(null, null, url);
    await this.#callback?.(this.#routeDefinition);
  }
  async refresh() {
    return new Promise(async (resolve) => {
      await this.#callback?.(this.#routeDefinition);
      resolve();
    });
  }
  setParameters(parameters) {
    if (this.#routeDefinition == null)
      return;
    for (const key of Object.keys(parameters)) {
      this.#routeDefinition.params[key] = parameters[key];
    }
  }
  setQueries(queries) {
    if (this.#routeDefinition == null)
      return;
    for (const key of Object.keys(queries)) {
      this.#routeDefinition.query[key] = queries[key];
    }
  }
}
export {
  RouteManager
};
