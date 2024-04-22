import "./../../components/interactive-map/interactive-map-actions.js";
import "./../../components/interactive-map/interactive-map.js";

export default class Map extends crsbinding.classes.ViewBase {

    async preLoad() {

    }

    async connectedCallback() {

        await super.connectedCallback();


        const container = this.element.querySelector("#maps-container");


        this.setProperty("map", "#openstreetmap");

        await this.mapReady();
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

        await crs.call("interactive_map", "initialize", { element: "#openstreetmap"});

        await crs.call("interactive_map", "show_drawing_tools", {
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
                                -77.032013,
                                38.931639
                            ],
                            [
                                -77.029095,
                                38.899984
                            ],
                            [
                                -76.971073,
                                38.88983
                            ],
                            [
                                -77.059994,
                                38.884619
                            ],
                            [
                                -77.032013,
                                38.931639
                            ]
                        ]
                    ]
                }
            }
        });
    }
}