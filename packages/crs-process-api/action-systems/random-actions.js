class RandomActions {
  static async perform(step, context, process, item) {
    return await this[step.action](step, context, process, item);
  }
  static async generate_object(step, context, process, item) {
    const definition = await crs.process.getValue(step.args.definition, context, process, item);
    const result = {};
    for (let [field, value] of Object.entries(definition)) {
      let parts = value.split(":");
      const type = parts[0];
      parts.splice(0, 1);
      switch (type) {
        case "auto": {
          result[field] = step.args.auto;
          break;
        }
        case "string": {
          result[field] = await RandomActions.string({ args: { length: parts[0] } }, context, process, item);
          break;
        }
        case "integer": {
          result[field] = await RandomActions.integer({ args: { min: parts[0], max: parts[1] } }, context, process, item);
          break;
        }
        case "float": {
          result[field] = await RandomActions.float({ args: { min: parts[0], max: parts[1] } }, context, process, item);
          break;
        }
        case "date": {
          result[field] = await RandomActions.date({ args: { min: parts[0], max: parts[1] } }, context, process, item);
          break;
        }
        case "time": {
          result[field] = await RandomActions.time({ args: {} }, context, process, item);
          break;
        }
        case "duration": {
          result[field] = await RandomActions.duration({ args: {} }, context, process, item);
          break;
        }
        case "boolean": {
          result[field] = await RandomActions.boolean({ args: {} }, context, process, item);
        }
        case "uuid": {
          result[field] = crypto.randomUUID();
          break;
        }
      }
    }
    if (step.args.target != null) {
      await crs.process.setValue(step.args.target, result, context, process, item);
    }
    return result;
  }
  static async generate_collection(step, context, process, item) {
    const definition = await crs.process.getValue(step.args.definition, context, process, item);
    const count = await crs.process.getValue(step.args.count, context, process, item);
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(await RandomActions.generate_object({
        args: {
          auto: i,
          definition
        }
      }, context, process, item));
    }
    if (step.args.target != null) {
      await crs.process.setValue(step.args.target, result, context, process, item);
    }
    return result;
  }
  static async integer(step, context, process, item) {
    let result = Math.floor(Math.random() * (step.args.max - step.args.min + 1)) + step.args.min;
    if (step.args?.target != null) {
      await crs.process.setValue(step.args.target, result, context, process, item);
    }
    return result;
  }
  static async float(step, context, process, item) {
    let result = Math.random() * (step.args.max - step.args.min + 1) + step.args.min;
    if (step.args?.target != null) {
      await crs.process.setValue(step.args.target, result, context, process, item);
    }
    return result;
  }
  static async string(step, context, process, item) {
    let length = await crs.process.getValue(step.args.length, context, process, item);
    if (length == "auto") {
      length = Math.floor(Math.random() * (20 - 1)) + 0;
    }
    let result = Math.random().toString(36).substring(2, Number(length) + 2);
    if (step.args?.target != null) {
      await crs.process.setValue(step.args.target, result, context, process, item);
    }
    return result;
  }
  static async date(step, context, process, item) {
    const start = await crs.process.getValue(step.args.min, context, process, item);
    const end = await crs.process.getValue(step.args.max, context, process, item);
    const startDate = new Date(start);
    const endDate = new Date(end);
    let result = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    if (step.args?.target != null) {
      await crs.process.setValue(step.args.target, result, context, process, item);
    }
    return result;
  }
  static async time(step, context, process, item) {
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    const seconds = Math.floor(Math.random() * 60);
    const result = `${hours}:${minutes}:${seconds}`;
    if (step.args?.target != null) {
      await crs.process.setValue(step.args.target, result, context, process, item);
    }
    return result;
  }
  static async duration(step, context, process, item) {
    const day = Math.floor(Math.random() * 365);
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    const seconds = Math.floor(Math.random() * 60);
    const result = `P${day}DT${hours}H${minutes}M${seconds}S`;
    if (step.args?.target != null) {
      await crs.process.setValue(step.args.target, result, context, process, item);
    }
    return result;
  }
  static async boolean(step, context, process, item) {
    let result = Math.random() >= 0.5;
    if (step.args?.target != null) {
      await crs.process.setValue(step.args.target, result, context, process, item);
    }
    return result;
  }
}
crs.intent.random = RandomActions;
export {
  RandomActions
};
