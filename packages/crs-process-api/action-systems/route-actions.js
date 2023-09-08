import { RouteManager } from "./managers/router-manager.js";
class RouteActions {
  static async perform(step, context, process, item) {
    await this[step.action](step, context, process, item);
  }
  static async register(step, context, process, item) {
    const definition = await crs.process.getValue(step.args.definition, context, process, item);
    const routes = await crs.process.getValue(step.args.routes, context, process, item);
    const callback = await crs.process.getValue(step.args.callback, context, process, item);
    globalThis.routeManager = new RouteManager(routes, definition, callback);
  }
  static async dispose(step, context, process, item) {
    globalThis.routeManager?.dispose();
    delete globalThis.routeManager;
  }
  static async parse(step, context, process, item) {
    let url = await crs.process.getValue(step.args.url || window.location.href, context, process, item);
    if (url.indexOf("://") === -1)
      url = `http://${url}`;
    const result = {
      params: {},
      query: {}
    };
    const queries = url.split("?")[1]?.split("&");
    url = url.split("?")[0];
    const parts = url.split("/");
    result.protocol = parts[0].replace(":", "");
    result.host = parts[2];
    const parameters = globalThis.routeManager?.definition?.parameters;
    for (let i = 3; i < parts.length; i++) {
      const index = i - 3;
      const key = parameters?.[index] ?? index;
      result.params[key] = parts[i];
    }
    if (queries) {
      for (const query of queries) {
        const key = query.split("=")[0];
        const value = query.split("=")[1];
        result.query[key] = value;
      }
    }
    return result;
  }
  static async create_url(step, context, process, item) {
    const definition = await crs.process.getValue(step.args.definition, context, process, item);
    if (definition == null)
      return;
    const protocol = [definition.protocol || "http", "://"].join("");
    const host = definition.host;
    const parameters = [];
    const query = [];
    if (definition.params) {
      for (const key in definition.params) {
        parameters.push(definition.params[key]);
      }
    }
    if (definition.query) {
      for (const key in definition.query) {
        query.push([`${key}=${definition.query[key]}`]);
      }
    }
    const paramString = parameters.join("/");
    const queryString = query.length === 0 ? "" : `?${query.join("&")}`;
    return `${protocol}${host}/${paramString}${queryString}`;
  }
  static async goto(step, context, process, item) {
    await globalThis.routeManager?.goto(step.args.definition);
  }
  static async refresh(step, context, process, item) {
    await globalThis.routeManager?.refresh();
  }
  static async set_parameters(step, context, process, item) {
    const parameters = await crs.process.getValue(step.args.parameters, context, process, item);
    if (parameters == null)
      return;
    const refresh = await crs.process.getValue(step.args.refresh || false, context, process, item);
    globalThis.routeManager.setParameters(parameters);
    if (refresh) {
      await globalThis.routeManager.refresh();
    }
  }
  static async set_queries(step, context, process, item) {
    const queries = await crs.process.getValue(step.args.queries, context, process, item);
    if (queries == null)
      return;
    const refresh = await crs.process.getValue(step.args.refresh || false, context, process, item);
    globalThis.routeManager?.setQueries(queries);
    if (refresh) {
      await globalThis.routeManager.refresh();
    }
  }
}
crs.intent.route = RouteActions;
export {
  RouteActions
};
