import "../../packages/crs-process-api/action-systems/css-grid-actions.js";

/**
 * 1. create css grid for SLA visualization
 * 2. create css grid for SLA layer including areas
 */


/**
 * Create and set the css grid on the sla visualization
 * @param data {Object} - sla initialization object - see data.js
 * @param slaVisualization {HTMLElement} element that is the sla visualization component
 * @return {Promise<void>}
 */
export async function create_sla_grid(data, slaVisualization) {
    // 1. create css grid
    // 1.1 the status cell area name = cl_status_${statusId} e.g. cl_status_1001 and cl_status_1002

    const element = slaVisualization
    const numberOfRows = data.statuses.length + 2;
    const numberOfColumns = data.sla.length + 1;

    createInitialGrid(element, numberOfRows, numberOfColumns);

    // Generate the grid template array
    element.style.gridTemplate = generateGridTemplateArray(data.statuses, data.sla).join('\n');

    createStatusLabels(element, data.statuses);
    createRowElements(element, data.statuses);
    createSlaLayers(element, data.sla);

    // 2. create sla text elements and place on grid

    // 3. create sla layer and place on grid
    // 3.1 when creating the sla layer, you need to pass the css grid rows text on because it needs to use it
}


/**
 * @method createInitialGrid - creates the initial grid for the sla visualization
 * @param element {HTMLElement} - the sla visualization element
 * @param numberOfRows {Number} - the number of rows
 * @param numberOfColumns {Number} - the number of columns
 * @returns {void}
 */

function createInitialGrid(element, numberOfRows, numberOfColumns) {
    crs.call("cssgrid", "init", {element: element, id: "sla-grid"});
}


/**
 * Create the status labels
 * @param element {HTMLElement} - the sla visualization element
 * @param statuses {[Object]} - the array of status objects
 */

function createStatusLabels(element, statuses) {
    // based on the status object, create the status labels for each status object
    // the status label should be a div with the class status-label and the area set to the relevant status area
    // the area should be set to the relevant status area
    // the status label should be appended to the sla visualization element and display in the correct status-area

    const statusBackground = document.createElement("div");
    statusBackground.classList.add("status-background");
    element.shadowRoot.appendChild(statusBackground);

    for(const item of statuses) {
        const statusLabel = document.createElement("div");
        statusLabel.id = `status_${item.id}`;
        statusLabel.classList.add("status-label");
        statusLabel.style.gridArea = `status_${item.id}`;
        statusLabel.textContent = item.name;
        element.shadowRoot.appendChild(statusLabel);
    }



}

function createRowElements(element, statuses) {
    let index = 1;

    for (let status of statuses) {
        const div = document.createElement("div");
        div.dataset.status = status.id;
        div.style.gridRow = index;
        div.classList.add("status-row");
        element.shadowRoot.appendChild(div);
        index++;
    }
}

/**
 * Create the sla layers
 * @param element {HTMLElement} - the sla visualization element
 * @param sla {[Object]} - the array of sla objects
 */

function createSlaLayers(element, slaCollection) {
    // based on the sla object, create the sla layers for each sla object
    // the sla layer should be a div with the class sla-layer and the area set to the relevant sla area
    // the area should be set to the relevant sla area
    // the sla layer should be appended to the sla visualization element and display in the correct sla-area

    for(const sla of slaCollection) {
        const slaLayer = document.createElement("div");
        slaLayer.id = `sla_${sla.id}`;
        slaLayer.classList.add("sla-layer");
        slaLayer.style.gridArea = `sla_${sla.id}`;
        slaLayer.textContent = sla.code;
        element.shadowRoot.appendChild(slaLayer);
    }

    // NB!!!!!
    // The Sla will be created via the process api.
}

/**
 * Apply the regions to the element
 * @param element {HTMLElement} - the sla visualization element
 * @param regions {[Object]} - the array of regions
 */

function applyRegions(element, regions) {

}

/**
 * Create the sla regions
 * @param element {HTMLElement} - the sla visualization element
 * @param sla {[Object]} - the array of sla objects
 * @param regions {[Object]} - the array of regions
 */

function createSlaRegions(sla) {
}

/**
 * Create the status regions
 * @param element {HTMLElement} - the sla visualization element
 * @param statuses {[Object]} - the array of status objects
 * @param regions {[Object]} - the array of regions
 */

function createStatusRegions(statuses) {
}

// Function to generate the grid template string
/**
 * Generate the grid template array
 * @param dataStatuses {[Object]} - the array of status objects
 * @param dataSla {[Object]} - the array of sla objects
 * @returns {[string]} - the generated grid template array
 */
function generateGridTemplateArray(dataStatuses, dataSla) {
    dataStatuses.unshift({id: -1});
    dataStatuses.push({id: -1});

    // Create the grid template array
    // Loop through the statuses and sla to create the grid template array
    // For example : '". status_1 status_2 status_3" 2rem'
    const reversedStatuses = [...dataStatuses].reverse();

    const gridTemplateArray = reversedStatuses.map(status => {
        let row = status.id === -1 ? "." : `status_${status.id}`;
        let slaArray = dataSla.map(sla => ` sla_${sla.id}`);
        // add the row height
        // the row and slaArray are joined together to form the row with "" around it

        let rowHeight = " 1fr";

        return `"${row + slaArray.join('')}"${rowHeight}`;
    });

    let columnWidth = dataSla.map(sla => "auto").join(' ');
    // add the column width for the status column at the beginning of the string

    columnWidth = `/ auto ${columnWidth}`;

    // add the column width to the end of the grid template array
    gridTemplateArray.push(columnWidth);


    return gridTemplateArray;
}


/**
 * Apply the css columns to the element
 * @param element {HTMLElement} - the sla visualization element
 * @param numberOfColumns {Number} - the number of columns
 */

function applyCssColumns(element, numberOfColumns) {
    // element.style.gridTemplateColumns = `repeat(${numberOfColumns}, 1fr)`;
    crs.call("cssgrid", "set_columns", {element: element, columns: `repeat(${numberOfColumns}, 1fr)`});
}

/**
 * Apply the css rows to the element
 * @param element {HTMLElement} - the sla visualization element
 * @param numberOfRows {Number} - the number of rows
 */

function applyCssRows(element, numberOfRows) {
    crs.call("cssgrid", "set_rows", {element: element, rows: `repeat(${numberOfRows}, 1fr)`});
}