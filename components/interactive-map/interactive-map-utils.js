export async function createStandardMap(container) {
    const map = L.map(container, { preferCanvas: true});
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
        minZoom: -5
    })
    L.imageOverlay(imageUrl, bounds).addTo(map);
    // TODO determine bounds from image
    // This code is not yet complete. Its a placeholder for when we add interactive graphics
    const bounds = [[0, 0], [1406, 2300]];
    map.fitBounds(bounds);
    return map;
}