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
export async function create_sla_grid(data,slaGridContainer, slaVisualization) {
    const element = slaGridContainer
    const slaVisualizationPhase = slaVisualization.dataset.phase; // refactor for phase
    slaVisualization.shadowRoot.querySelector("#measurement-name").style.display = "flex"
    if (slaVisualizationPhase === "runtime"){
        slaVisualization.shadowRoot.querySelector("#sla-legend").style.display = "flex"
    }

    //update the dataStatuses array
    const statuses = updateStatusData(data.statuses);

    const reversedStatuses = [...statuses].reverse();

    reversedStatuses.unshift({ code: -1, index: -1 });
    reversedStatuses.push({ code: -1, index: -1 });


    createInitialGrid(element);

    // Generate the grid template array
    element.style.gridTemplate = generateGridTemplateArray(reversedStatuses, data.sla, slaVisualizationPhase).join(' '); // refactor for phase
    // element.dataset.workOrderStatus = data.workOrder.currentStatus; // Remove or num chucks

    createStatusLabels(element, reversedStatuses);
    createRowElements(element, reversedStatuses);
    createSlaLayers(element, data.sla);
}


/**
 * @method createInitialGrid - creates the initial grid for the sla visualization
 * @param element {HTMLElement} - the sla visualization element
 * @returns {void}
 */

function createInitialGrid(element) {
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
    element.appendChild(statusBackground);

    const statusHeader = document.createElement("span");
    statusHeader.classList.add("status-description");
    statusHeader.textContent = "Status";
    statusBackground.appendChild(statusHeader);


    for(const status of statuses) {
        if (status.index === -1) {
            continue;
        }
        const statusLabel = document.createElement("div");
        statusLabel.id = `status_${status.index}`;
        statusLabel.dataset.statusOrder = status.order;
        statusLabel.classList.add("status-label");
        statusLabel.style.gridArea = `status_${status.index}`;
        if (status.code !== -1){
            statusLabel.textContent =`[${status.code}] ${status.description}`;
        }
        element.appendChild(statusLabel);
    }
}

/**
 * @method createRowElements - creates the row elements for the sla visualization
 * @param element {HTMLElement} - the sla visualization element
 * @param statuses {[Object]} - the array of status objects
 */
function createRowElements(element, statuses) {
    let indexCount = 1;


    for (let i = statuses.length - 1; i >= 0; i--) {
        const status = statuses[i];
        const div = document.createElement("div");
        div.dataset.status = status.index;
        div.dataset.id = status.description;
        div.style.gridRow = indexCount;
        div.classList.add("status-row");
        element.appendChild(div);
        if (indexCount === statuses.length) {
            div.classList.add("sla-footer-border");
        }

        indexCount++;
    }
}

/**
 * @method createSlaLayers - creates the sla layers for the sla visualization
 * @param element {HTMLElement} - the sla visualization element
 * @param slaCollection {[Object]} - the array of sla objects
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

        element.appendChild(slaLayer);
    }
}


// Function to generate the grid template string
/**
 * @method generateGridTemplateArray - generates the grid template array for the sla visualization
 * @param dataStatusesMap {[Object]} - the array of status objects
 * @param dataSla {[Object]} - the array of sla objects
 * @param visualizationPhase {string} - the phase of the visualization
 * @returns {[string]} - the generated grid template array
 */
function generateGridTemplateArray(statuses, dataSla, visualizationPhase) { // refactor for phase


    let statusCount = 1;

    const gridTemplateArray = statuses.map(status => {
        let rowHeight = statusCount === 1 && visualizationPhase === "runtime" ? "3fr" : "1fr"; // refactor for phase
        statusCount++;
        let row = status.code === -1 ? "." : `status_${status.index}`;
        let slaArray = dataSla.map(sla => ` sla_${sla.id}`);
        return `"${row + slaArray.join('')}"${rowHeight}`;
    });

    let columnWidth = dataSla.map(sla => "max-content").join(' ');
    // add the column width for the status column at the beginning of the string

    columnWidth = `/ max-content ${columnWidth}`;

    // add the column width to the end of the grid template array
    gridTemplateArray.push(columnWidth);

    return gridTemplateArray;
}

function updateStatusData(dataStatuses) {
    const keys = Object.keys(dataStatuses);
    // Create the result array with updated indexes
    let result = [];
    for (let i = 0; i < keys.length; i++) {
        const status = dataStatuses[keys[i]];
        if (status.code === -1) {
            continue;
        }
        status.index = i;
        result.push(status);
    }

    return result;
}