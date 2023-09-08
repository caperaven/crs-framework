class ScriptsActions {
  static async perform(step, context, process, item) {
    await this[step.action]?.(step, context, process, item);
  }
  static async load_file(step, context, process, item) {
    const id = await crs.process.getValue(step.args.id, context, process, item);
    const file = await crs.process.getValue(step.args.file, context, process, item);
    return new Promise((resolve) => {
      const element = document.querySelector(`#${id}`);
      if (element != null) {
        return resolve(element);
      }
      const script = document.createElement("script");
      script.onload = () => resolve(script);
      script.id = id;
      script.setAttribute("src", file);
      document.getElementsByTagName("head")[0].appendChild(script);
    });
  }
  static async unload_file(step, context, process, item) {
    const id = await crs.process.getValue(step.args.id);
    const element = document.querySelector(`#${id}`);
    element.parentElement.removeChild(element);
  }
}
crs.intent.scripts = ScriptsActions;
export {
  ScriptsActions
};
