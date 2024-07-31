import "./sla-visualization.js";
import "./sla-layer/sla-layer-actions.js";

/**
 * @class SlaVisualizationActions - A class that contains methods for the sla-visualization component
 *
 * @method initialize - Initializes the sla visualization component
 * @method render - Renders the sla visualization component
 */

export class SlaVisualizationActions {


    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    /**
     * @method initialize - Initializes the sla visualization component
     * @param step {Object} - The step object in a process
     * @param context {Object} - The context object
     * @param process {Object} - The process object
     * @param item {Object} - The item object if in a loop
     *
     *  example:
     *
     *   cl_status   |        cl_sla        |        cl_sla        |    row 1
     * ------------- | -------------------- | -------------------- | -----------
     *   status 3    |   __ SLA 1 region __ |   __ SLA 2 region __ |    row 2
     *   status 2    |   __ SLA 1 region __ |   __ SLA 2 region __ |    row 3
     *   status 1    |   __ SLA 1 region __ |   __ SLA 2 region __ |    row 4
     *  ...
     */
    static async initialize(step, context, process, item) {
        const element = await crs.dom.get_element(step, context, process, item);

        const statuses = await crs.process.getValue(step.args.statuses, context, process, item);
        const currentStatus = await crs.process.getValue(step.args.currentStatus, context, process, item);

        await element.initialize(statuses, currentStatus);
    }

    /**
     * @method render - Renders the sla visualization component
     * @param step {Object} - The step object in a process
     * @param context {Object} - The context object
     * @param process {Object} - The process object
     * @param item {Object} - The item object if in a loop
     * @returns {Promise<void>}
     */
    static async render(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        await element.render();
    }
}

crs.intent.sla_visualization = SlaVisualizationActions;