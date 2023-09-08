class SystemActions {
  static async perform(step, context, process, item) {
    await this[step.action]?.(step, context, process, item);
  }
  static async copy_to_clipboard(step, context, process, item) {
    let value = await crs.process.getValue(step.args.source, context, process, item);
    const shouldStringify = await crs.process.getValue(step.args.shouldStringify, context, process, item) ?? true;
    const str = shouldStringify === true ? JSON.stringify(value) : value;
    await navigator.clipboard.writeText(str);
  }
  static async sleep(step, context, process, item) {
    return new Promise(async (resolve) => {
      const duration = await crs.process.getValue(step.args.duration, context, process, item);
      let interval = setInterval(() => {
        clearInterval(interval);
        resolve();
      }, Number(duration || 0));
    });
  }
  static async pause(step, context, process) {
    return new Promise((resolve) => {
      process.status = "wait";
      let bc;
      const resume = (nextStep) => {
        delete process.status;
        delete process.resume;
        delete bc?.resume;
        if (typeof nextStep != "object") {
          step.alt_next_step = nextStep;
        }
        resolve();
      };
      if (process.parameters?.bId != null) {
        bc = crsbinding.data.getContext(process.parameters.bId);
        bc.resume = resume;
      }
      process.resume = resume;
    });
  }
  static async resume(step, context, process, item) {
    process.resume?.();
  }
  static async abort(step, context, process, item) {
    const error = await crs.process.getValue(step.args.error, context, process, item);
    throw new Error(error);
  }
  static async is_mobile(step, context, process, item) {
    return /Mobi|Android/i.test(navigator.userAgent);
  }
  static async is_portrait(step, context, process, item) {
    let result = window.matchMedia("(orientation: portrait)").matches;
    if (step?.args?.target != null) {
      await crs.process.setValue(step.args.target, result, context, process, item);
    }
    return result;
  }
  static async is_landscape(step, context, process, item) {
    let result = window.matchMedia("(orientation: landscape)").matches;
    if (step?.args?.target != null) {
      await crs.process.setValue(step.args.target, result, context, process, item);
    }
    return result;
  }
}
crs.intent.system = SystemActions;
export {
  SystemActions
};
