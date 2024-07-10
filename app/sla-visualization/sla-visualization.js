import "./../../components/sla-visualization/sla-visualization-actions.js";
import "./../../components/sla-visualization/sla-layer/sla-layer-actions.js";
import "./../../components/sla-visualization/sla-measurement/sla-measurement-actions.js";
import {data1, data2, data3} from "./data.js";
import "./../../components/sla-visualization/sla-visualization.js";
import "../../src/managers/data-manager/data-manager-actions.js";

export default class SlaVisualization extends crsbinding.classes.ViewBase {

    constructor() {
        super();
        globalThis.translations ||= {}

        globalThis.translations.noContent = {
            title: "No Records Found",
            message: "Either you do not have sufficient user rights required to display the records or there are no records to be displayed."
        }
    }

    async connectedCallback() {
        await super.connectedCallback();
        globalThis.translations = {};
        globalThis.translations.sla = {
            labels: {
                startLabel: "Start Status : ",
                endLabel: "End Status : ",
                durationLabel: "Duration : ",
                progressLabel: "Work Progress : ",
                triggerLabel: "Next Trigger : ",
                triggerDescriptionLabel: "Trigger Description : ",
                numberOfTriggersLabel: "Number of Triggers : "
            }
        }

        await crs.call("data_manager", "register", {
            manager: "my_sla",
            id_field: "id",
            type: "memory",
            request_callback: async () => {
                return data2.sla
            }
        });

        await crs.call("sla_visualization", "initialize", {
            element: document.querySelector("sla-visualization"),
            statuses: data2.statuses,
            currentStatus: data2.currentStatus,
        })
    }

    async disconnectedCallback() {
        globalThis.translations = null;
        await super.disconnectedCallback();
    }

    async initializeRuntime() {
        const slaVisualization = document.querySelector("sla-visualization");
        slaVisualization.enable();

    }

    async logSelection() {
       console.log(this.getProperty("mySelection"))
    }

    async removeMeasurement() {
        const parentElement = document.querySelector("sla-visualization#setup");
        await crs.call("sla_measurement", "remove_measurement", {
            element: parentElement
        })
    }
}