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

    const regions = [];

    createInitialGrid(element, numberOfRows, numberOfColumns);

    // applyCssRows(element, numberOfRows);
    //
    // applyCssColumns(element, data.sla.length);
    //
    // createStatusRegions(element, data.statuses, regions);
    //
    // createSlaRegions(element, data.sla, regions);
    //
    // applyRegions(element, regions);
    //
    // createStatusLabels(element, data.statuses);
    //
    // createSlaLayers(element, data.sla);

    // NB: Loop backwards because the end of the data is at the top
    // ["A", "B", "C", "D"]
    // results to
    // D
    // C
    // B
    // A
    // create css grid and add the status labels (REVIEW)

    // // ** create status text
    // for (const status of data.statuses) {
    //     const cell_name = `cl_statues_${status.id}` // use this for region name
    // }
    //
    // data.statuses.prepend({id: -1})    // add a dummy status at the top of the list
    // data.statuses.append({id: -1})          // add a dummy status at the bottom of the list
    //
    // // ** create row indicators
    // for (let i = 0; i < numberOfRows; i++) {
    //     const div = document.createElement("div")
    //     div.dataset.status = data.statuses[i].id;
    //     // add div to UI and set the right row and column css values
    //     // span the div across all columns
    // }

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
    // const grid = element
    crs.call("cssgrid", "init", {element: element, id: "sla-grid"});
    element.style.display = "grid";

    applyCssRows(element, numberOfRows);
    applyCssColumns(element, numberOfColumns);

    // Create rows and columns as elements
    for (let i = 0; i < numberOfRows; i++) {
        const row = document.createElement('div');
        row.classList.add('grid-row');
        element.appendChild(row);
        // for (let j = 0; j < numberOfColumns; j++) {
        //     const column = document.createElement('div');
        //     column.classList.add('grid-column');
        //     row.appendChild(column);
        // }
    }

    console.log(element);
    console.log("grid created");

}


/**
 * Create the status labels
 * @param element {HTMLElement} - the sla visualization element
 * @param statuses {[Object]} - the array of status objects
 */

function createStatusLabels(element, statuses) {
    // const statusLabels = element.shadowRoot.querySelector("#status-labels");
    // for (const status of statuses) {
    //     const label = document.createElement("div");
    //     label.textContent = status.name;
    //     statusLabels.appendChild(label);
    // }
}

/**
 * Create the sla layers
 * @param element {HTMLElement} - the sla visualization element
 * @param sla {[Object]} - the array of sla objects
 */

function createSlaLayers(element, sla) {
    // const slaLayer = element.shadowRoot.querySelector("#sla-layer");
    // for (const item of sla) {
    //     const layer = document.createElement("div");
    //     layer.id = item.id;
    //     layer.textContent = item.code;
    //     slaLayer.appendChild(layer);
    // }
}

/**
 * Apply the regions to the element
 * @param element {HTMLElement} - the sla visualization element
 * @param regions {[Object]} - the array of regions
 */

function applyRegions(element, regions) {
    // const grid = element.shadowRoot.querySelector("#sla-grid");
    // for (const region of regions) {
    //     grid.style.gridTemplateAreas = region.area;
    // }
}

/**
 * Create the sla regions
 * @param element {HTMLElement} - the sla visualization element
 * @param sla {[Object]} - the array of sla objects
 * @param regions {[Object]} - the array of regions
 */

function createSlaRegions(element, sla, regions) {
    // for (const item of sla) {
    //     const region = {
    //         area: `cl_sla_${item.id}`
    //     }
    //     regions.push(region);
    // }
}

/**
 * Create the status regions
 * @param element {HTMLElement} - the sla visualization element
 * @param statuses {[Object]} - the array of status objects
 * @param regions {[Object]} - the array of regions
 */

function createStatusRegions(element, statuses, regions) {
    // for (const status of statuses) {
    //     const region = {
    //         area: `cl_status_${status.id}`
    //     }
    //     regions.push(region);
    // }
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
    // element.style.gridTemplateRows = `repeat(${numberOfRows}, 1fr)`;

    crs.call("cssgrid", "set_rows", {element: element, rows: `repeat(${numberOfRows}, 1fr)`});
}