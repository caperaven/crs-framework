import "./../../components/interactive-map/interactive-map-actions.js";
import "./../../components/interactive-map/interactive-map.js";
import "../../components/toast-notification/toast-notification-actions.js";

export default class Map extends crsbinding.classes.ViewBase {

    async preLoad() {

    }

    async connectedCallback() {

        await super.connectedCallback();

        await crs.call("toast_notification", "enable", { position: "bottom-center", margin: 10 });

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

        // Set data to cape town
        await crs.call("interactive_map", "add_geo_json", {
            element: "#openstreetmap",
            layer: "default",
            data: {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                18.42038154602051,
                                -33.396382242852945
                            ],
                            [
                                18.42038154602051,
                                -34.926382242852945
                            ],
                            [
                                19.42038154602051,
                                -34.926382242852945
                            ],
                            [
                                19.42038154602051,
                                -33.926382242852945
                            ],
                        ]
                    ]
                }
            }

        });
    }

    async getLayerGeoJson() {
        const geoJson =  await crs.call("interactive_map", "get_layer_geo_json", {
            element: "#openstreetmap",
            layer: "default"
        });

        console.log(geoJson);
    }

    async setLayerGeoJson() {

        // add some data to johannesburg
        await crs.call("interactive_map", "add_geo_json", {
            element: "#openstreetmap",
            layer: "default",
            move_to: true,
            replace: true,
            data: {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                27.925262451171875,
                                -26.20410235599473
                            ],
                            [
                                27.925262451171875,
                                -27.20410235599473
                            ],
                            [
                                28.925262451171875,
                                -27.20410235599473
                            ],
                            [
                                28.925262451171875,
                                -26.20410235599473
                            ],
                            [
                                27.925262451171875,
                                -26.20410235599473
                            ]
                        ]
                    ]
                }
            }
        });
    }
}