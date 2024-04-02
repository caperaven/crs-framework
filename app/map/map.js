import "./../../components/interactive-map/interactive-map-actions.js";

export default class Map extends crsbinding.classes.ViewBase {

    preLoad() {
        this.setProperty("map", "#openstreetmap");
    }

    async mapChanged(mode) {
        this.setProperty("mode", "none");
    }

    async modeChanged(mode) {
        await crs.call("interactive_map", "set_mode", {
            element: this.getProperty("map"),
            mode: mode
        });
    }

    addPolygon() {
        const polygonGeoJSON = {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [-77.034084142948, 38.909671288923],
                        [-77.032908, 38.910568],
                        [-77.033983, 38.911562],
                        [-77.035866, 38.9115],
                        [-77.034084142948, 38.909671288923]
                    ]
                ]
            },
            "properties": {
                "name": "Example Polygon"
            }
        };



        this.map.addToMap(polygonGeoJSON);
    }

    addPoint() {

        const markerGeoJSON = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-77.034084142948, 38.909671288923]
            },
            "properties": {
                "name": "Example Marker"
            }
        };

        this.map.addPoint(markerGeoJSON);
    }

    locateMe() {
        this.map.locateMe();
    }
}