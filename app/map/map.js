import "./../../components/interactive-map/interactive-map-actions.js";

export default class Map extends crsbinding.classes.ViewBase {

    async preLoad() {

    }

    async connectedCallback() {

        await super.connectedCallback();


        const container = this.element.querySelector("#maps-container");






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

    async mapReady() {
        await crs.call("interactive_map", "initialize", {
            element: "#openstreetmap"
        });

        await crs.call("interactive_map", "add_geo_json", {
            element: "#openstreetmap",
            data: {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                13.4765625,
                                56.9449741808516
                            ],
                            [
                                13.4765625,
                                57.32652122521709
                            ],
                            [
                                13.9306640625,
                                57.32652122521709
                            ],
                            [
                                13.9306640625,
                                56.9449741808516
                            ],
                            [
                                13.4765625,
                                56.9449741808516
                            ]
                        ]
                    ]
                }
            }
        });
    }
}