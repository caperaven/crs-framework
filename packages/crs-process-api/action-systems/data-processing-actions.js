import init, { unique_values, filter, group, get_perspective } from "./../bin/data_processing.js";
await init();
class DataProcessing {
  static async perform(step, context, process, item) {
    await this[step.action](step, context, process, item);
  }
  static init_panic_hook(step, context, process, item) {
    init_panic_hook();
  }
  static async unique_values(step, context, process, item) {
    const data = await crs.process.getValue(step.args.source, context, process, item);
    const fields = await crs.process.getValue(step.args.fields, context, process, item);
    const rows = await crs.process.getValue(step.args.rows, context, process, item);
    if (!Array.isArray(data)) {
      throw new Error("Fields must be an array");
    }
    if (!Array.isArray(fields)) {
      throw new Error("Fields must be an array");
    }
    const result = unique_values(data, fields, rows);
    if (step.args.target) {
      await crs.process.setValue(step.args.target, result, context, process, item);
    }
    return result;
  }
  static async filter(step, context, process, item) {
    const data = await crs.process.getValue(step.args.source, context, process, item);
    const intent = await crs.process.getValue(step.args.intent, context, process, item);
    const case_sensitive = await crs.process.getValue(step.args.case_sensitive ?? false, context, process, item);
    const result = filter(data, intent, case_sensitive);
    if (step.args.target) {
      await crs.process.setValue(step.args.target, result, context, process, item);
    }
    return result;
  }
  static async group(step, context, process, item) {
    const data = await crs.process.getValue(step.args.source, context, process, item);
    const intent = await crs.process.getValue(step.args.intent, context, process, item);
    const rows = await crs.process.getValue(step.args.rows, context, process, item);
    const result = group(data, intent, rows);
    if (step.args.target) {
      await crs.process.setValue(step.args.target, result, context, process, item);
    }
    return result;
  }
  static async get_perspective(step, context, process, item) {
    const data = await crs.process.getValue(step.args.source, context, process, item);
    const intent = await crs.process.getValue(step.args.intent, context, process, item);
    const result = get_perspective(data, intent);
    if (step.args.target) {
      await crs.process.setValue(step.args.target, result, context, process, item);
    }
    return result;
  }
}
crs.intent.data_processing = DataProcessing;
export {
  DataProcessing
};
