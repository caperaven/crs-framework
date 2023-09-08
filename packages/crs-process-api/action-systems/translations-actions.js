class TranslationsActions {
  static async perform(step, context, process, item) {
    await this[step.action]?.(step, context, process, item);
  }
  static async add(step, context, process, item) {
    const translations = await crs.process.getValue(step.args.translations, context, process, item);
    const ctx = await crs.process.getValue(step.args.context, context, process, item);
    await crsbinding.translations.add(translations, ctx);
  }
  static async get(step, context, process, item) {
    let key = await crs.process.getValue(step.args.key, context, process, item);
    key = key.split("/").join(".");
    let result = await crsbinding.translations.get(key);
    if (step.args.target != null) {
      await crs.process.setValue(step.args.target, result, context, process, item);
    }
    return result;
  }
  static async delete(step, context, process, item) {
    const ctx = await crs.process.getValue(step.args.context, context, process, item);
    await crsbinding.translations.delete(ctx);
  }
  static async translate_elements(step, context, process, item) {
    const element = await crs.dom.get_element(step.args.element);
    await crsbinding.translations.parseElement(element);
  }
  static async inflate(step, context, process, item) {
    const key = await crs.process.getValue(step.args.key, context, process, item);
    const parameters = await crs.process.getValue(step.args.parameters, context, process, item);
    let string = await crsbinding.translations.get(key);
    let result = await crs.call("string", "inflate", {
      template: string,
      parameters
    }, context, process, item);
    if (step.args.target != null) {
      await crs.process.setValue(step.args.target, result, context, process, item);
    }
    return result;
  }
}
crs.intent.translations = TranslationsActions;
export {
  TranslationsActions
};
