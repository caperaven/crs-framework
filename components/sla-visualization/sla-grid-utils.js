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

    const numberOfRows = data.statuses.length + 2;

    const regions = [];

    applyCssRows(element, numberOfRows);

    applyCssColumns(element, data.sla.length);

    createStatusRegions(element, data.statuses, regions);

    createSlaRegions(element, data.sla, regions);

    applyRegions(element, regions);

    createStatusLabels(element, data.statuses);

    createSlaLayers(element, data.sla);

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