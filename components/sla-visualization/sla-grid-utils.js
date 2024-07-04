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

    const statuses = await buildStatusArray(data.statuses);

    await createInitialGrid(element);

    // Generate the grid template array
    element.style.gridTemplate = generateGridTemplateArray(statuses, data.sla, slaVisualizationPhase).join(' '); // refactor for phase

    createStatusLabels(element, statuses);
    await createRowElements(element, statuses);
    await createSlaLayers(element, data.sla);
}

/**
 * @method createInitialGrid - creates the initial grid for the sla visualization
 * @param element {HTMLElement} - the sla visualization element
 * @returns {void}
 */
async function createInitialGrid(element) {
    await crs.call("cssgrid", "init", {element: element, id: "sla-grid"});
}

/**
 * Create the status labels
 * @param element {HTMLElement} - the sla visualization element
 * @param statuses {[Object]} - the array of status objects
 */
function createStatusLabels(element, statuses) {
    const statusBackground = document.createElement("div");
    statusBackground.classList.add("status-background");
    element.appendChild(statusBackground);

    const statusHeader = document.createElement("span");
    statusHeader.classList.add("status-description");
    statusHeader.textContent = "Status"; //Todo CML: REPLACE WITH TRANSLATION
    statusBackground.appendChild(statusHeader);

    for(const status of statuses) {
        const statusLabel = document.createElement("div");
        statusLabel.id = `s${status.index}`;
        statusLabel.dataset.statusOrder = status.order;
        statusLabel.classList.add("status-label");
        statusLabel.style.gridArea = `s${status.index}`;
        if (status.description !== "header" && status.description !== "footer") {
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
async function createRowElements(element, statuses) {
    let indexCount = 1;
    const documentFragment = document.createDocumentFragment();
    for (const status  of statuses) {
        const className = status.description !== "footer" ? "status-row" : "status-row sla-footer-border";
        const rowElement =  await buildStandardElement(status.description,className, null,null, indexCount++)
        rowElement.dataset.status = status.index;
        rowElement.dataset.id = status.description;

        documentFragment.appendChild(rowElement);
    }
    element.appendChild(documentFragment);
}

/**
 * @method createSlaLayers - creates the sla layers for the sla visualization
 * @param element {HTMLElement} - the sla visualization element
 * @param slaCollection {[Object]} - the array of sla objects
 */
async function createSlaLayers(element, slaCollection) {
    let incrementor = 1;
    const documentFragment = document.createDocumentFragment();
    for(const sla of slaCollection) {
        const slaLayer = await buildStandardElement(`sla-${sla.id}`, "sla-layer", null, `sla${incrementor++}`);
        documentFragment.appendChild(slaLayer);
    }
    element.appendChild(documentFragment);
}

/**
 * @method generateGridTemplateArray - generates the grid template string
 * @param statuses {[Object]} - the array of status objects
 * @param dataSla {[Object]} - the array of sla objects
 * @param visualizationPhase {string} - the phase of the visualization
 * @returns {[string]} - the generated grid template array
 */
function generateGridTemplateArray(statuses, dataSla, visualizationPhase) {
    let rowHeight;
    let statusCount = 1;
    const slaArray = dataSla.map(sla => ` sla${statusCount++}`);

    statusCount = 1;
    const gridTemplateArray = statuses.map(status => {
        rowHeight = status.index === 0 ? "2.5rem":"1fr";
        if (statusCount === 1 && visualizationPhase === "runtime") {
            rowHeight = "5rem";
            statusCount++;
        }

        let row = `"s${status.index}${slaArray.join('')}"${rowHeight}`
        return row;
    });

    let columnWidth = ("max-content ").repeat(dataSla.length).trim();

    columnWidth = `/ 14rem ${columnWidth}`;

    gridTemplateArray.push(columnWidth);

    return gridTemplateArray;
}

async function buildStatusArray(statusList) {
    const tempStatusList = {footer:{description: "footer"},...statusList,header:{description: "header"}};
    const keys = Object.keys(tempStatusList);
    let result = [];

    for (let i = 0; i < keys.length; i++) {
        const status = tempStatusList[keys[i]];
        status.index = i;
        result.push(status);
    }

    return result.reverse();
}

export async function buildStandardElement(id, classes, textContent, gridArea = null, gridRow= null) {
    const element = document.createElement("div");

    element.id = id;
    element.className = classes;
    if (gridArea != null) {
        element.style.gridArea = gridArea;
    }
    if (gridRow != null) {
        element.style.gridRow = gridRow;
    }
    if (textContent != null) {
        element.textContent = textContent;
    }
    return element;
}