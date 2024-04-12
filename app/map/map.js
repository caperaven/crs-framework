import "./../../components/interactive-map/interactive-map-actions.js";

export default class Map extends crsbinding.classes.ViewBase {

    async connectedCallback() {
        await super.connectedCallback();


        const container = this.element.querySelector("#maps-container");

        await crs.call("interactive_map", "initialize_lib");

        const map1 = document.createElement("interactive-map");
        map1.dataset.provider = "openstreetmap";
        map1.dataset.fillColor = "blue";
        map1.dataset.strokeColor = "red";
        map1.setAttribute("id", "openstreetmap");
        container.appendChild(map1);

        const map2 = document.createElement("interactive-map");
        map2.setAttribute("data-provider", "image");
        map2.setAttribute("data-image-url", "app/map/floorplan.jpg");
        map2.setAttribute("id", "floorplan");
        container.appendChild(map2);

        this.setProperty("map", "#openstreetmap");
    }

    async mapChanged(mode) {
        this.setProperty("mode", "none");
    }

    async modeChanged(mode) {
        if(this.getProperty("map") == null) {return};

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

    async fillColorChanged(color) {
        await crs.call("interactive_map", "set_colors", {
            element: this.getProperty("map"),
            fill_color: color
        });
    }

    async strokeColorChanged(color) {
        await crs.call("interactive_map", "set_colors", {
            element: this.getProperty("map"),
            stroke_color: color
        });
    }
}