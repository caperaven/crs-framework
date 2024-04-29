import "./sla-layer.js";
import "./../sla-measurement/sla-measurement-actions.js";

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

        for (const sla of slaData.sla) {
            const element = document.createElement("sla-layer");
            element.id = sla.id;
            element.shadowRoot.textContent = sla.code;
            element.style.gridArea = `sla_${sla.id}`
            element.dataset.parentPhase = parentPhase; // refactor for phase
            parentElement.shadowRoot.appendChild(element);

            await createSlaGrid(element, sla, slaData.statuses);
            // in the sla data, based on the workOrder.statusDescription, call function:
            // showCurrentWorkOrderStatus(workOrder.statusDescription, element);
            await showCurrentWorkOrderStatus(slaData.workOrder.statusDescription, parentElement);
            element.dataset.activeRow = parentElement.shadowRoot.querySelector(".active-status-row").dataset.status;

            // Added to wait for the measurements to be created before creating the headers.
            // Timing issues occur when the headers are created before the measurements are created.
            await onSlaLayerLoading(element, async () => {
                await crs.call("sla_measurement", "create_all", { parent: element, data: sla.measurements, parentPhase: element.dataset.parentPhase, statuses: slaData.statuses });
            })

            for(const measurement of element.shadowRoot.querySelectorAll("sla-measurement")) {
                const measurementOverlay = document.createElement("div");
                measurementOverlay.id = `m_${measurement.id}`;
                measurementOverlay.classList.add("measurement-overlay");
                measurementOverlay.style.gridArea = `m_${measurement.id}`;
                measurementOverlay.style.gridRow = `2 / span ${slaData.statuses.length - 2}`;
                element.shadowRoot.appendChild(measurementOverlay);
            }

            // loop to create sla headers and place them in the correct grid area
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
 * @param statusData {Array} - The status data
 * @return {Promise<void>}
 */
async function createSlaGrid(slaLayerElement, slaItemData, statusData) {
    /**
     * The measurement has a start and end status.
     * We need a lookup table so that we know where to put the measurement in the grid.
     */
    const statusLookupTable = createStatusLookupTable(statusData);
    const matrix = createMeasurementsMatrix(statusData, slaItemData);
    populateMeasurementsMatrix(matrix, statusLookupTable, slaItemData);
    slaLayerElement.style.gridTemplate = matrixToTemplate(matrix, slaLayerElement);
}

/**
 * @method createStatusLookupTable - Create a lookup table so that we can see what row index represents the status based on id.
 * @param statusData {Array} - The status data
 * @return {{}}
 */
function createStatusLookupTable(statusData) {
    // create a dictionary where the key is the status id and the value is the index in the grid.
    const lookupTable = {};
    let index = statusData.length - 2;

    for (let i = 0; i < statusData.length; i++) {
        const status = statusData[i];

        if (status.id === -1) {
            lookupTable[status.id] = -1
        }
        else {
            lookupTable[status.id] = index;
            index--;
        }
    }

    return lookupTable;
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
    const numberOfRows = statusData.length;
    // const numberOfColumns = slaItemData.measurements.length;

    // Here we check if the number of measurements is less than 3, if it is we set the number of columns to 3.
    // This is because we want to have at least 3 columns in the grid for it to display the SLA-Headers correctly.
    const numberOfColumns = slaItemData.measurements.length < 3 ? 3 : slaItemData.measurements.length;

    const matrix = [];
    initializeMatrix(matrix, numberOfRows, numberOfColumns);

    for (let i = 0; i < numberOfColumns; i++) {
        matrix[0][i] = "header";
        // matrix[numberOfRows - 1][i] = `f_${slaItemData.measurements[i].id}`;
        matrix[numberOfRows - 1][i] = slaItemData.measurements[i] ? `f_${slaItemData.measurements[i].id}` : `f_${slaItemData.measurements[0].id}`;

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
function populateMeasurementsMatrix(matrix, statusLookupTable, slaItemData) {
    let measurementIndex = 0;
    for (const measurement of slaItemData.measurements) {
        const startIndex = statusLookupTable[measurement.start_status];
        const endIndex = statusLookupTable[measurement.end_status];

        for (let index = endIndex; index <= startIndex; index++) {
            matrix[index][measurementIndex] = `m_${measurement.id}`;
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

    // If there is only one column, we set the width to 12rem.
    // If there are more than one column, we set the width to 5rem.
    // ToDo: AW - Discuss with Dancus and Rabie if we should set the width to 12rem if there is only one column. (see createMeasurementsMatrix)
    // for (let i = 0; i < matrix[0].length; i++) {
    //     if (matrix[0].length === 1) {
    //         columns.push("12rem");
    //         break;
    //     }
    //     columns.push("5rem");
    // }

    const result = [];
    for (let row = 0; row < matrix.length; row++) {
        // If the row is the first row and the parent phase is runtime, we set the height to 3fr for the Header.
        let rowStr;
        if (row === 0 && slaLayerElement.dataset.parentPhase === "runtime") {
            rowStr = `"${matrix[row].join(" ")}" 3fr`;
        } else {
            rowStr = `"${matrix[row].join(" ")}" 1fr`;
        }
        result.push(rowStr);
    }

    result.push(`/ ${columns.join(" ")}`);
    return result.join("\n");
}

/**
 * @method createSlaHeader - Creates the sla header component. It uses the inflation manager to inflate the data into the component.
 * @param slaLayerElement {HTMLElement} - The sla layer element
 * @param slaItemData {Object} - The sla item data
 */

async function createSlaHeader(slaLayerElement, slaItemData) {
    const slaHeaderTemplate = slaLayerElement.shadowRoot.querySelector("template.sla-header-template");
    const slaHeader = slaHeaderTemplate.content.cloneNode(true);

    await crs.binding.staticInflationManager.inflateElement(slaHeader.firstElementChild, slaItemData);

    slaLayerElement.shadowRoot.appendChild(slaHeader);
}

/**
 * @method showCurrentWorkOrderStatus - Shows the current work order status and applies the correct styles on the sla grid visualization.
 * @param statusDescription {String} - The status description
 * @param parentElement {HTMLElement} - The parent element
 */

async function showCurrentWorkOrderStatus(statusDescription, parentElement) {
    // apply the class "active-status-label" to the status label that matches the status description
    const statusLabels = parentElement.shadowRoot.querySelectorAll(".status-label");
    for (const statusLabel of statusLabels) {
        if (statusLabel.textContent === statusDescription) {
            statusLabel.classList.add("active-status-label");
        }
    }

    // apply the class "active-status-row" to the row that matches the status description key.
    const statusRows = parentElement.shadowRoot.querySelectorAll(".status-row");
    for (const statusRow of statusRows) {
        if (statusRow.dataset.id === statusDescription) {
            statusRow.classList.add("active-status-row");
        }
    }

}

crs.intent.sla_layer = SlaLayerActions;