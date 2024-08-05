import "../../../packages/crs-process-api/action-systems/css-grid-actions.js";

/**
 * @method create_sla_grid -  Create and set the css grid on the sla visualization
 * @param data {Object} - sla initialization object - see data.js
 * @param slaGridContainer {HTMLElement} - the container for the sla grid
 * @param labelContainer {HTMLElement} - the container for the status labels
 * @param slaVisualization {HTMLElement} element that is the sla visualization component
 * @return {Promise<void>}
 */
export async function create_sla_grid(data,slaGridContainer, labelContainer,slaVisualization) {
    const element = slaGridContainer
    const slaVisualizationPhase = slaVisualization.dataset.phase; // refactor for phase
    if (slaVisualizationPhase === "runtime"){
        slaVisualization.shadowRoot.querySelector("#sla-legend").style.display = "flex"
    }

    const statuses = await buildRows(data.orderedStatuses);

    await createInitialGrid(element);

    // Generate the grid template array
    const gridString= generateGridTemplateArray(statuses, data.sla, slaVisualizationPhase).join(' '); // refactor for phase
    element.style.gridTemplate = gridString;
    labelContainer.style.gridTemplate = gridString;

    await createStatusLabels(labelContainer, statuses, gridString);
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
 * @method createStatusLabels -  Create the status labels
 * @param labelContainer {HTMLElement} - the container for the status labels
 * @param statuses {[Object]} - the array of status objects
 * @param gridString
 */
async function createStatusLabels(labelContainer, statuses, gridString) {
    const documentFragment = document.createDocumentFragment();

    const statusBackground = await buildStandardElement("div","status-label-background","status-background")
    const statusHeader = await buildStandardElement("span","status-header","status-description", globalThis.translations.sla.labels.slaStatus)

    statusBackground.appendChild(statusHeader);

    documentFragment.appendChild(statusBackground);
    for(const status of statuses) {
        const statusLabel = await buildStandardElement("div",`status-${status.index}`, "status-label", null, `s${status.index}`);
        statusLabel.dataset.statusOrder = status.order;

        if (status.id !== "header" && status.id !== "footer") {
            statusLabel.dataset.code = `[${status.code}]`;
            statusLabel.dataset.id = status.id;
            statusLabel.dataset.description = status.description;
            statusLabel.title = status.description;
        }

        documentFragment.appendChild(statusLabel);
    }
    labelContainer.appendChild(documentFragment);
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
        const className = status.id !== "footer" ? "status-row" : "status-row sla-footer-border";
        const rowElement =  await buildStandardElement("div",status.id,className, null,null, indexCount++)
        rowElement.dataset.status = status.index;
        rowElement.dataset.id = status.id;

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
        const slaLayer = await buildStandardElement("div",`sla-${sla.id}`, "sla-layer", null, `sla${incrementor++}`);
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
    let statusCount = 1;
    const slaArray = dataSla.map(sla => ` sla${statusCount++}`);

    const gridTemplateArray = [];
    let headerRow = visualizationPhase === "runtime" ? "6rem" :  "2.5rem";

    // Add the header row
    gridTemplateArray.push(buildGridRowString(statuses[0], slaArray, headerRow));

    for (let row = 1; row < statuses.length - 1; row++) {
        // Add the status row
        gridTemplateArray.push(buildGridRowString(statuses[row], slaArray, "minmax(2.5rem, 1fr)"));
    }

    // Add the footer row
    gridTemplateArray.push(buildGridRowString(statuses[statuses.length - 1], slaArray, "2.5rem"));

    let columnWidth = ("max-content ").repeat(dataSla.length).trim();

    columnWidth = `/ ${columnWidth}`;

    gridTemplateArray.push(columnWidth);

    return gridTemplateArray;
}

/**
 * @method buildGridRowString - builds the grid row string used in the grid template
 * @param status {Object} - the status object
 * @param slaArray {[string]} - the array of sla strings
 * @param height {string} - the height of the row
 * @returns {`"${string}" ${string}`}
 */
function buildGridRowString(status, slaArray, height) {
    let rowStr = `s${status.index}${slaArray.join('')}`;
    rowStr = `"${rowStr}" ${height}`;
    return rowStr;
}

/**
 * @method buildRows - builds the rows for the sla visualization
 * @param statusList {[Object]} - the array of status objects
 * @returns {Promise<[{code: string, index: number, id: string}]>}
 */
export async function buildRows(statusList) {
    let result =[{id: "header", code : "head", index: 0}];

    let index = 1;
    // We loop through the statusList in reverse order to get the correct order of the statuses from bottom to top
    for (let i = statusList.length -1; i >= 0; i--) {
        const status = statusList[i];
        status.index = index;
        result.push(status);

        index++;
    }

    result.push({id: "footer", code : "foot", index: statusList.length+1});
    return result;
}

/**
 * @method buildStandardElement - creates a standard element
 * @param tagName {string} - the tag name of the element
 * @param id {string} - the id of the element
 * @param classes {string} - the classes of the element
 * @param textContent {string} - the text content of the element
 * @param gridArea {string} - the grid area of the element where it should be placed
 * @param gridRow {string} - the grid row of the element
 * @returns {Promise<HTMLAnchorElement|HTMLElement|HTMLAreaElement|HTMLAudioElement|HTMLBaseElement|HTMLQuoteElement|HTMLBodyElement|HTMLBRElement|HTMLButtonElement|HTMLCanvasElement|HTMLTableCaptionElement|HTMLTableColElement|HTMLDataElement|HTMLDataListElement|HTMLModElement|HTMLDetailsElement|HTMLDialogElement|HTMLDivElement|HTMLDListElement|HTMLEmbedElement|HTMLFieldSetElement|HTMLFormElement|HTMLHeadingElement|HTMLHeadElement|HTMLHRElement|HTMLHtmlElement|HTMLIFrameElement|HTMLImageElement|HTMLInputElement|HTMLLabelElement|HTMLLegendElement|HTMLLIElement|HTMLLinkElement|HTMLMapElement|HTMLMenuElement|HTMLMetaElement|HTMLMeterElement|HTMLObjectElement|HTMLOListElement|HTMLOptGroupElement|HTMLOptionElement|HTMLOutputElement|HTMLParagraphElement|HTMLPictureElement|HTMLPreElement|HTMLProgressElement|HTMLScriptElement|HTMLSelectElement|HTMLSlotElement|HTMLSourceElement|HTMLSpanElement|HTMLStyleElement|HTMLTableElement|HTMLTableSectionElement|HTMLTableCellElement|HTMLTemplateElement|HTMLTextAreaElement|HTMLTimeElement|HTMLTitleElement|HTMLTableRowElement|HTMLTrackElement|HTMLUListElement|HTMLVideoElement>}
 */
export async function buildStandardElement(tagName, id, classes, textContent=null, gridArea = null, gridRow= null) {
    const element = document.createElement(tagName);

    element.id = id;

    if (classes != null) {
        element.className = classes;
    }
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