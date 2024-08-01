import "./../../components/sla-visualization/sla-visualization-actions.js";
import "./../../components/sla-visualization/sla-layer/sla-layer-actions.js";
import "./../../components/sla-visualization/sla-measurement/sla-measurement-actions.js";
import {data1, data2, data3, data4} from "./data.js";
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
        globalThis.translations.contextMenu = {
        };
        globalThis.translations.sla = {
            labels: {
                startLabel: "Start Status : ",
                endLabel: "End Status : ",
                durationLabel: "Duration : ",
                progressLabel: "Work Progress : ",
                triggerLabel: "Triggers : ",
                slaMeasureLabel: "SLA Measure :",
                slaStatus: "Status",
                slaMeasurementFooter: "Measurement Name",
                slaHeaderCode: "Code",
                slaHeaderDescription: "Description",
                slaLegendInRange: "In Status Range",
                slaLegendOutOfRange: "Out Of Status Range",
                slaLegendWarning: "Warning",
                slaLegendOverdue: "Overdue",
                mainMeasurePercentageLabel: "Main Measure %"
            }
        }

        globalThis.translations.noContent = {
            title: "No Records Found",
            message: "Either you do not have sufficient user rights required to display the records or there are no records to be displayed."
        }

        await crs.call("data_manager", "register", {
            manager: "my_sla",
            id_field: "id",
            type: "memory",
            request_callback: async () => {
                return data2.sla
            }
        });


    }

    async disconnectedCallback() {
        globalThis.translations = null;
        await crs.call("data_manager", "dispose", {
            manager: "my_sla"
        })
        await super.disconnectedCallback();
    }

    /**
     * @method initializeRuntime - Initializes the runtime
     * @returns {Promise<void>}
     */
    async initializeRuntime() {
        const slaVisualization = document.querySelector("sla-visualization");
        await crs.call("sla_visualization", "initialize", {
            element: slaVisualization,
            statuses: data2.statuses,
            currentStatus: data2.currentStatus,
        })

        await slaVisualization.enable();

    }

    /**
     * @method logSelection - Logs the selected measurements when in Setup Phase
     * @returns {Promise<void>}
     */
    async logSelection() {
       console.log(this.getProperty("mySelection"))
    }
}