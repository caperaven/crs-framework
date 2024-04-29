import "./sla-visualization.js";
import "./sla-layer/sla-layer-actions.js";
import {create_sla_grid} from "./sla-grid-utils.js"

/**
 * class SlaMeasurementActions - A class that contains methods for the sla-measurement component
 */

export class SlaVisualizationActions {

    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    /**
     * 1. Create Css-Grid for SLA-Visualization
     * 1.1 How many statuses do I have - css rows = status count + 2 (one at the top and one at the bottom)
     * 1.2 How many sla items do I have - this affects the number of columns in the css grid
     *
     * 2. Create child components
     * 2.1 create the content in the component that will show the status text (div)
     * 2.2 create the rows so that we can see the horizontal lines across
     *
     *   cl_status        cl_sla                cl_sla
     * | --------- | ------------------ | ------------------ |    row 1
     * | status 3  | __ SLA 1 region __ | __ SLA 2 region __ |    row 2
     * | status 2  | __ SLA 1 region __ | __ SLA 2 region __ |    row 3
     * | status 1  | __ SLA 1 region __ | __ SLA 2 region __ |    row 4
     *  ...
     * 3. create sla layer and set it's area to the relevant sla area
     */
    static async initialize(step, context, process, item) {
        const data = await crs.process.getValue(step.args.data, context, process, item);
        const parentPhase = await crs.process.getValue(step.args.phase, context, process, item); // refactor for phase
        const element = await crs.dom.get_element(step.args.element, context, process, item);

        await create_sla_grid(data, element);
        await crs.call("sla_layer", "create_all_sla", { parent: element, data: data , parentPhase: parentPhase}); // refactor for phase
        await crs.call("component", "notify_ready", { element: element });
    }

}

crs.intent.sla_visualization = SlaVisualizationActions;