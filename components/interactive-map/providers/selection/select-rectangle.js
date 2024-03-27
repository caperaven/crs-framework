// This class will create markers on the map for the selected rectangle.
// When it gets initialized, it will create markers on the corners of the rectangle passed in.
// When moving the markers, the rectangle will be resized.
// When dragging the rectangle, the markers will move.
// We are using leaflet to draw the rectangle and markers on the map.

export default class SelectRectangleProvider {
    #rectangle;
    #map;
    #markers;
    #markerDragHandler = this.#onMarkerDrag.bind(this);

    async initialize(map, rectangle) {
        this.#map = map;
        this.#rectangle = rectangle;
        this.#markers = [];

        this.#createMarkers();
    }

    async dispose() {
        this.#map = null;
        this.#rectangle = null;
        this.#markers.forEach(marker => marker.remove());
        this.#markers = [];
    }

    async #createMarkers() {
        const bounds = this.#rectangle.getBounds();
        const corners = [
            bounds.getNorthWest(),
            bounds.getNorthEast(),
            bounds.getSouthEast(),
            bounds.getSouthWest()
        ];

        corners.forEach(corner => {
            const customIcon = L.divIcon({
                className: 'marker',
                html: "<div class='icon'>radio-button-unchecked</div>",
                iconSize: [32, 32], // Size of the icon
                iconAnchor: [16, 16] // Point of the icon which will correspond to marker's location
            });
            const marker = L.marker(corner, {icon: customIcon, draggable: true }).addTo(this.#map);
            marker.on("drag", this.#markerDragHandler);
            this.#markers.push(marker);
        });
    }

    async #onMarkerDrag(event) {
        await this.#setNewBounds(event.target);
    }

    /*
       In this function we need to get the current bounds of the markers.
       Then we need to update markers the related markers depending the marker that was dragged.
       This is to ensure when we move the marker for example to the left using the top left marker, then the bottom left marker should also move.
       Also, when moving for example upwards using the top right marker, then the top left marker should also move.
       This is to ensure the rectangle is resized correctly.
     */
    async #setNewBounds(marker) {
        const bounds = this.#rectangle.getBounds();
        const corners = [
            bounds.getNorthWest(),
            bounds.getNorthEast(),
            bounds.getSouthEast(),
            bounds.getSouthWest()
        ];

        const index = this.#markers.indexOf(marker);
        const oppositeIndex = (index + 2) % 4;

        let markerLatLng = marker.getLatLng();
        let oppositeMarkerLatLng = this.#markers[oppositeIndex].getLatLng();

        // Check if the marker has moved past the opposite marker
        if ((index % 2 === 0 && markerLatLng.lat > oppositeMarkerLatLng.lat) ||
            (index % 2 === 1 && markerLatLng.lng < oppositeMarkerLatLng.lng)) {
            // Swap the markers
            [markerLatLng, oppositeMarkerLatLng] = [oppositeMarkerLatLng, markerLatLng];
        }

        const newBounds = L.latLngBounds(markerLatLng, oppositeMarkerLatLng);

        // Update the rectangle's bounds
        this.#rectangle.setBounds(newBounds);

        // Update the positions of the other markers
        this.#updateMarkers(newBounds);

    }

    #updateMarkers(bounds) {
        const corners = [
            bounds.getNorthWest(),
            bounds.getNorthEast(),
            bounds.getSouthEast(),
            bounds.getSouthWest()
        ];

        this.#markers.forEach((marker, index) => {
            marker.setLatLng(corners[index]);
        });
    }

}



