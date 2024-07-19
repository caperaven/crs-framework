import "./sla-layer.js";
import "./../sla-measurement/sla-measurement-actions.js";
import {buildRows} from "../sla-utils/sla-grid-utils.js";

/**
 * class SlaLayerActions - A class that contains methods for the sla-layer component
 */

export class SlaLayerActions{

    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    /**
     * @method create_all_sla - Creates the sla layer component
     * @param step {Object} - The step object in a process
     * @param context {Object} - The context object
     * @param process {Object} - The process object
     * @param item {Object} - The item object if in a loop
     * @param parent {Object} - The parent element to attach the component to
     * @param data {[Object]} - The array of objects where each object contains the data for the component
     */

    static async create_all_sla(step, context, process, item) {
        const parentElement = await crs.dom.get_element(step.args.parent, context, process, item);
        const parentPhase = await crs.process.getValue(step.args.parentPhase, context, process, item);
        const slaData = await crs.process.getValue(step.args.data, context, process, item);

        // for each sla object in the data array of objects, create a sla-layer component
        // set the inner text of the sla-layer component to the code of the sla object
        // here the sla will be displayed in the specified grid-area based on the sla code. example: "sla_1001"
        let incrementor = 1;
        const gridRows =  await buildRows(slaData.orderedStatuses);

        for (const sla of slaData.sla) {
            const element = document.createElement("sla-layer");
            element.id = sla.id;
            element.shadowRoot.textContent = sla.code;
            element.style.gridArea = `sla${incrementor++}`;
            element.dataset.parentPhase = parentPhase; // refactor for phase
            parentElement.appendChild(element);

            await createSlaGrid(element, sla, gridRows, slaData.statuses);
            // in the sla data, based on the workOrder.statusDescription, call function:
            await showCurrentStatus(slaData.currentStatus, parentElement);
            if (parentPhase === "runtime") {
                element.dataset.activeRow = slaData.currentStatusIndex;
            }

            //Added to wait for the measurements to be created before creating the headers.
            //Timing issues occur when the headers are created before the measurements are created.
            await onSlaLayerLoading(element, async () => {
                await crs.call("sla_measurement", "create_all", {
                    parent: element,
                    data: sla.measurements,
                    parentPhase: element.dataset.parentPhase,
                    statuses: slaData.statuses
                });
            })

            await createSlaHeader(element, sla);
        }
    }
}

/**
 * @method performSlaLayerCallback - Performs the sla layer callback
 * @param slaLayerElement {HTMLElement} - The sla layer element
 * @param callback {Function} - The callback function
 * @param resolve {Function} - The resolve function
 * @return {Promise<void>}
 */
async function performSlaLayerCallback(slaLayerElement, callback, resolve) {
    await callback();
    slaLayerElement.dataset.status = "loaded";
    resolve();
}

/**
 * @method onSlaLayerLoading - Waits for the sla layer to finish loading before executing the callback
 * @param slaLayerElement {HTMLElement} - The sla layer element
 * @param callback {Function} - The callback function
 * @return {Promise<unknown>}
 */
function onSlaLayerLoading(slaLayerElement, callback) {
    return new Promise(async resolve => {
        if (slaLayerElement.dataset.status === "loading") {
            await performSlaLayerCallback(slaLayerElement, callback, resolve);
        }

        slaLayerElement.addEventListener("loading", async () => {
            await performSlaLayerCallback(slaLayerElement, callback, resolve);
        })
    })
}

/**
 * @method createSlaGrid - Creates the sla grid visualization
 * @param slaLayerElement {HTMLElement} - The sla layer element
 * @param slaItemData {Object} - The sla item data
 * @param orderedStatuses {Array} - The status data
 * @return {Promise<void>}
 */
async function createSlaGrid(slaLayerElement, slaItemData, orderedStatuses, statusLookupTable) {
    /**
     * The measurement has a start and end status.
     * We need a lookup table so that we know where to put the measurement in the grid.
     */
    const matrix = createMeasurementsMatrix(orderedStatuses, slaItemData);

    populateMeasurementsMatrix(matrix, slaItemData, statusLookupTable);
    slaLayerElement.style.gridTemplate = matrixToTemplate(matrix, slaLayerElement);
}

/**
 * Create a matrix with the correct size.
 * The rows must be the same as the statuses including the header and the footer.
 * The columns must be for each measurement
 * ----------------------
 * | header header header
 * | .      .      m1
 * | .      m2     m1
 * | m1     m2     .
 * | m1     .      .
 * | footer footer footer
 *
 * @method createMeasurementsMatrix - Creates the measurements matrix
 * @param statusData {Array} - The status data
 * @param slaItemData {Object} - The sla item data
 */
function createMeasurementsMatrix(statusData, slaItemData) {
    const keys = Object.keys(statusData);
    const numberOfRows = keys.length;

    // Here we check if the number of measurements is less than 3, if it is we set the number of columns to 3.
    // This is because we want to have at least 3 columns in the grid for it to display the SLA-Headers correctly.
    const numberOfColumns = slaItemData.measurements.length < 3 ? 3 : slaItemData.measurements.length;

    const matrix = [];
    initializeMatrix(matrix, numberOfRows, numberOfColumns);

    for (let i = 0; i < numberOfColumns; i++) {
        matrix[0][i] = "header";

        matrix[numberOfRows - 1][i] = slaItemData.measurements[i] ? `f${i}` : `.`;
    }

    return matrix;
}

/**
 * @method initializeMatrix - Initializes the matrix with the correct values.
 * @param matrix {Array} - The matrix
 * @param numberOfRows {Number} - The number of rows
 * @param numberOfColumns {Number} - The number of columns
 */
function initializeMatrix(matrix, numberOfRows, numberOfColumns) {
    for (let i = 0; i < numberOfRows; i++) {
        const row = [];
        matrix.push(row);
        for (let j = 0; j < numberOfColumns; j++) {
            row.push(".")
        }
    }
}

/**
 * @method populateMeasurementsMatrix - Populates the measurements matrix with the correct values.
 * @param matrix {Array} - The matrix
 * @param statusLookupTable {Object} - The status lookup table {statusId: index}
 * @param slaItemData {Object} - The sla item data
 */
function populateMeasurementsMatrix(matrix, slaItemData, statusLookupTable) {
    let measurementIndex = 0;

    for (const measurement of slaItemData.measurements) {

        const endIndex = statusLookupTable[measurement.start_status].index; // End index is the start status index
        const startIndex = statusLookupTable[measurement.end_status].index; // Start index is the end status index

        for (let index = startIndex; index <= endIndex; index++) {
            matrix[index][measurementIndex] = `m${measurementIndex}`;
        }

        measurementIndex++;
    }
}

/**
 * @method matrixToTemplate - Converts the matrix to a template string that can be used to set the grid-template-areas property.
 * @param matrix {Array} - The matrix
 * @param slaLayerElement {HTMLElement}- The sla layer element
 * @return {string}
 */
function matrixToTemplate(matrix, slaLayerElement) {
    const columns = [];
    for (let i = 0; i < matrix[0].length; i++) {
        columns.push("5rem");
    }

    const result = [];
    let headerRowHeight = slaLayerElement.dataset.parentPhase === "runtime" ? "6rem" : "2.5rem";

    // Add header
    result.push(buildRowString(matrix, 0, headerRowHeight))

    for (let row = 1; row < matrix.length - 1; row++) {
        // Add the status row
        result.push(buildRowString(matrix, row, "minmax(2.5rem,1fr)"));
    }

    // Add footer
    result.push(buildRowString(matrix, matrix.length - 1, "2.5rem"));

    result.push(` / ${columns.join(" ")}`);
    return result.join("\n");
}

/**
 * @method buildRowString - Builds the row string
 * @param matrix {Array} - The matrix
 * @param row {Number} - The row number
 * @param height {String} - The height
 * @returns {string}
 */
function buildRowString(matrix, row, height) {
    let rowStr = matrix[row].join(" ");
    rowStr = `"${rowStr}" ${height}`;
    return rowStr;
}

/**
 * @method createSlaHeader - Creates the sla header component. It uses the inflation manager to inflate the data into the component.
 * @param slaLayerElement {HTMLElement} - The sla layer element
 * @param slaItemData {Object} - The sla item data
 */

async function createSlaHeader(slaLayerElement, slaItemData) {
    const slaHeaderTemplate = slaLayerElement.shadowRoot.querySelector("template.sla-header-template");
    const slaHeader = slaHeaderTemplate.content.cloneNode(true);

    slaItemData = {
        ...slaItemData, codeLabel: globalThis.translations.sla.labels.slaHeaderCode,
        descriptionLabel: globalThis.translations.sla.labels.slaHeaderDescription,
        mainMeasurePercentageLabel: globalThis.translations.sla.labels.mainMeasurePercentageLabel,
    };


    await crsbinding.staticInflationManager.inflateElement(slaHeader.firstElementChild, slaItemData);

    slaLayerElement.shadowRoot.appendChild(slaHeader);
}

/**
 * @method showCurrentWorkOrderStatus - Shows the current work order status and applies the correct styles on the sla grid visualization.
 * @param currentStatus {String} - The status description
 * @param parentElement {HTMLElement} - The parent element
 */

async function showCurrentStatus(currentStatus, parentElement) {
    const statusActiveElements = parentElement.querySelectorAll(`[data-id='${currentStatus}']`);
    for (const element of statusActiveElements) {
        if (element.classList.contains("status-row")) {
            element.classList.add("active-status-row");
            continue;
        }
        element.classList.add("active-status-label");
    }
}

crs.intent.sla_layer = SlaLayerActions;