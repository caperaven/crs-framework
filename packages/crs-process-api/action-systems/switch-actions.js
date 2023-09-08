class SwitchActions {
  static async perform(step, context, process, item) {
    const value = await crs.process.getValue(step.args.check, context, process, item);
    const cases = await crs.process.getValue(step.args.cases, context, process, item);
    const defaultStep = await crs.process.getValue(step.args.default, context, process, item);
    const nextStepKey = cases[value] || defaultStep;
    if (nextStepKey == null)
      return;
    const nextStep = await crs.getNextStep(process, nextStepKey);
    if (nextStep != null) {
      await crs.process.runStep(nextStep, context, process, item);
    }
  }
}
crs.intent.switch = SwitchActions;
export {
  SwitchActions
};
