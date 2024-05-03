import "./../../components/sla-visualization/sla-visualization-actions.js";
import "./../../components/sla-visualization/sla-layer/sla-layer-actions.js";
import "./../../components/sla-visualization/sla-measurement/sla-measurement-actions.js";
import {data1, data2, data3} from "./data.js";
import "./../../components/sla-visualization/sla-visualization.js";
export default class SlaVisualization extends crsbinding.classes.ViewBase {

    async connectedCallback() {
        await super.connectedCallback();

    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
    }

    async initializeRuntime() {
        const slaVisualization = document.querySelector("sla-visualization#runtime");
        await crs.call("sla_visualization", "initialize", {
            element: slaVisualization,
            phase : slaVisualization.dataset.phase,
            data: data1
        })
    }

    async initializeSetup() {
        const slaVisualization = document.querySelector("sla-visualization#setup");
        await crs.call("sla_visualization", "initialize", {
            element: slaVisualization,
            phase : slaVisualization.dataset.phase,
            data: data2
        })
    }

    async removeMeasurement() {
        const parentElement = document.querySelector("sla-visualization#setup");
        await crs.call("sla_measurement", "remove_measurement", {
            element: parentElement
        })
    }
}