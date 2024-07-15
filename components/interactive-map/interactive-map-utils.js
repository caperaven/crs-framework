export async function createStandardMap(container) {
    const map = L.map(container, {preferCanvas: true, zoomControl: false});
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',

    }).addTo(map);

    // Set the view to start with
    map.setView([-33.900404, 18.610625], 10);

    return map;
}

export async function createImageMap(container, imageUrl) {
    const map = L.map(container, {
        crs: L.CRS.Simple,
        minZoom: -5,
        zoomControl: false
    })
    L.imageOverlay(imageUrl, bounds).addTo(map);
    // TODO determine bounds from image
    // This code is not yet complete. Its a placeholder for when we add interactive graphics
    const bounds = [[0, 0], [1406, 2300]];
    map.fitBounds(bounds);
    return map;
}

export function getShapeIndex(shape) {
    // Get the index from either shape options or feature properties
    return getShapeProperty(shape, 'index')
}

export function getShapeProperty(shape, property) {
    // Get the property from either shape options or feature properties
    return shape.options?.[property] ?? shape.feature?.properties?.[property];
}

export function isValidCoordinates(coordinatesString) {
    // Split the input string by comma
    const parts = coordinatesString.split(',');

    // Check if we have exactly two parts
    if (parts.length !== 2) {
        return false;
    }

    // Parse the parts as floats
    const latitude = parseFloat(parts[0]);
    const longitude = parseFloat(parts[1]);

    // Check if parsing was successful
    if (isNaN(latitude) || isNaN(longitude)) {
        return false;
    }

    // Validate the ranges
    if (latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) {
        return true;
    }

    return false;
}

/**
 * Add a popup to a layer based on a popup definition and record
 * @param layer
 * @param popupDefinition - The definition of the popup
 * @param record
 *
 * @example popupDefinition
 * {
 *         "title": "Reference Entity",
 *          "highlightColor": "red",
 *         "fields": [
 *              { "name": "name", "label": "Name" },
 *              { "name": "age", "label": "Age" },
 *              "$seperator",
 *              { "name": "address", "label": "Address" }
 *         ]
 * }
 */
export function addDynamicPopup(layer, popupDefinition, record) {
    let popupContent = [];
    popupContent.push(`<h3 class="${popupDefinition.type}">${popupDefinition.title}</h3>`);

    // Create html table for the fields
    popupContent.push("<table>");
    for (const field of popupDefinition.fields) {
        if (field === "$seperator") {
            popupContent.push("<tr><td colspan='2'><hr></td></tr>");
            continue;
        }

        const value = record[field.name] ?? "";
        popupContent.push(`<tr><td class="map-popup-label">${field.label}:</td><td>${value}</td></tr>`);
    }
    popupContent.push("</table>");

    const isMarker = layer instanceof L.Marker;
    const offset = isMarker ? [0, -50] : [0, -20];

    layer.bindTooltip(popupContent.join(''), {
        direction: 'top',
        sticky: !isMarker,
        offset: offset
    });
}

/**
 * Notify the instance that the coordinates have changed
 * @param instance - The instance to notify
 * @param point - The point that has changed or null if no point
 */
export function notifyCoordinatesChanged(instance, point) {
    let detail = "";
    if (point != null) {
        const latlng = point.getLatLng();
        detail = `${latlng.lat}, ${latlng.lng}`;
    }

    instance.dispatchEvent(new CustomEvent("update-coordinates", {detail: detail}));
}

/**
 * Apply shape
 */

