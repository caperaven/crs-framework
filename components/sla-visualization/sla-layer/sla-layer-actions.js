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
        const slaData = await crs.process.getValue(step.args.data, context, process, item);

        // for each sla object in the data array of objects, create a sla-layer component
        // set the inner text of the sla-layer component to the code of the sla object
        // here the sla will be displayed in the specified grid-area based on the sla code. example: "sla_1001"

        for (const sla of slaData.sla) {
            const element = document.createElement("sla-layer");
            element.id = sla.id;
            element.shadowRoot.textContent = sla.code;
            element.style.gridArea = `sla_${sla.id}`
            parentElement.shadowRoot.appendChild(element);

            await createSlaGrid(element, sla, slaData.statuses);

            await onSlaLayerLoading(element, async () => {
                await crs.call("sla_measurement", "create_all", { parent: element, data: sla.measurements });
            })

            for(const measurement of element.shadowRoot.querySelectorAll("sla-measurement")) {
                const measurementOverlay = document.createElement("div");
                measurementOverlay.classList.add("overlay"); //change class name!!
                measurementOverlay.style.gridArea = `m_${measurement.id}`;
                measurementOverlay.style.gridRow = `2 / span ${slaData.statuses.length - 2}`;
                element.shadowRoot.appendChild(measurementOverlay);
            }

            // loop to create sla headers and place them in the correct grid area
            await createSlaHeader(element, sla);


        }
    }
}

async function performSlaLayerCallback(slaLayerElement, callback, resolve) {
    await callback();
    slaLayerElement.dataset.status = "loaded";
    resolve();
}

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

async function createSlaGrid(slaLayerElement, slaItemData, statusData) {
    /**
     * The measurement has a start and end status.
     * We need a lookup table so that we know where to put the measurement in the grid.
     */
    const statusLookupTable = createStatusLookupTable(statusData);
    const matrix = createMeasurementsMatrix(statusData, slaItemData);
    populateMeasurementsMatrix(matrix, statusLookupTable, slaItemData);
    slaLayerElement.style.gridTemplate = matrixToTemplate(matrix);
}

/**
 * Create a lookup table so that we can see what row index represents the status based on id.
 * @param statusData
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
 */
function createMeasurementsMatrix(statusData, slaItemData) {
    const numberOfRows = statusData.length;
    const numberOfColumns = slaItemData.measurements.length;
    const matrix = [];
    initializeMatrix(matrix, numberOfRows, numberOfColumns);

    for (let i = 0; i < numberOfColumns; i++) {
        matrix[0][i] = "header";
        matrix[numberOfRows - 1][i] = `f_${slaItemData.measurements[i].id}`;
    }

    return matrix;
}

function initializeMatrix(matrix, numberOfRows, numberOfColumns) {
    for (let i = 0; i < numberOfRows; i++) {
        const row = [];
        matrix.push(row);
        for (let j = 0; j < numberOfColumns; j++) {
            row.push(".")
        }
    }
}

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

function matrixToTemplate(matrix) {
    const columns = [];
    for (let i = 0; i < matrix[0].length; i++) {
        columns.push("8rem");
    }

    const result = [];
    for (let row = 0; row < matrix.length; row++) {
        // const rowStr = `"${matrix[row].join(" ")}" 1fr`;
        // result.push(rowStr)
        let rowStr;
        if (row === 0) {
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
 * @method createSlaHeader - Creates the sla header component
 * @param slaLayerElement {HTMLElement} - The sla layer element
 * @param slaItemData {Object} - The sla item data
 */

async function createSlaHeader(slaLayerElement, slaItemData) {
    const slaHeaderTemplate = slaLayerElement.shadowRoot.querySelector("template.sla-header-template");
    const slaHeader = slaHeaderTemplate.content.cloneNode(true);

    await crs.binding.staticInflationManager.inflateElement(slaHeader.firstElementChild, slaItemData);

    slaLayerElement.shadowRoot.appendChild(slaHeader);
}

crs.intent.sla_layer = SlaLayerActions;