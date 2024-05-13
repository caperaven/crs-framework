import "./../../components/interactive-map/interactive-map-actions.js";
import "./../../components/interactive-map/interactive-map.js";
import "../../components/toast-notification/toast-notification-actions.js";
import "../../src/managers/data-manager/data-manager-actions.js";

export default class Map extends crsbinding.classes.ViewBase {

    async preLoad() {

    }

    async connectedCallback() {

        await super.connectedCallback();

        await crs.call("toast_notification", "enable", { position: "bottom-center", margin: 10 });

        const container = this.element.querySelector("#maps-container");

        await crs.call("data_manager", "register", {
            manager: "my_data",
            id_field: "id",
            type: "memory",
        });


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

    async clear() {
        await crs.call("interactive_map", "clear_layers", {
            element: this.getProperty("map")
        });
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

        // // Set data to cape town
        // await crs.call("interactive_map", "add_geo_json", {
        //     element: "#openstreetmap",
        //     layer: "default",
        //     data: {
        //         "type": "Feature",
        //         "properties": {},
        //         "geometry": {
        //             "type": "Polygon",
        //             "coordinates": [
        //                 [
        //                     [
        //                         18.42038154602051,
        //                         -33.396382242852945
        //                     ],
        //                     [
        //                         18.42038154602051,
        //                         -34.926382242852945
        //                     ],
        //                     [
        //                         19.42038154602051,
        //                         -34.926382242852945
        //                     ],
        //                     [
        //                         19.42038154602051,
        //                         -33.926382242852945
        //                     ],
        //                 ]
        //             ]
        //         }
        //     }
        //
        // });
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

        // const data =  {
        //     "type": "Feature",
        //     "properties": {},
        //     "geometry": {
        //         "type": "Polygon",
        //         "coordinates": [
        //             [
        //                 [
        //                     27.925262451171875,
        //                     -26.20410235599473
        //                 ],
        //                 [
        //                     27.925262451171875,
        //                     -27.20410235599473
        //                 ],
        //                 [
        //                     28.925262451171875,
        //                     -27.20410235599473
        //                 ],
        //                 [
        //                     28.925262451171875,
        //                     -26.20410235599473
        //                 ],
        //                 [
        //                     27.925262451171875,
        //                     -26.20410235599473
        //                 ]
        //             ]
        //         ]
        //     }
        // };

        const polygons =  await this.generateRandomPolygonsGeoJson(2);
        const points = await this.generateRandomPointsGeoJson(2);

        await crs.call("data_manager", "set_records", {
            manager: "my_data",
            id_field: "id",
            type: "memory",
            records: [...polygons, ...points]
        })
    }


    async generateRandomPolygonsGeoJson(count) {
        // Create a random geojson polygons object for the the provided count

        const data = [];

        for(let i = 0; i < count; i++) {
            const lat = Math.random() * 180 - 90;
            const lng = Math.random() * 360 - 180;

            const geoJson = {
                "type": "Feature",
                "properties": {
                    "id": i,
                    "name": `Polygon ${i}`
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                lng,
                                lat
                            ],
                            [
                                lng + 1,
                                lat
                            ],
                            [
                                lng + 1,
                                lat + 1
                            ],
                            [
                                lng,
                                lat + 1
                            ],
                            [
                                lng,
                                lat
                            ]
                        ]
                    ]
                }
            };

            data.push(geoJson);
        }
        return data;
    }

    async generateRandomPointsGeoJson(count) {
        // Create a random geojson points object for the the provided count

        const data = [];

        for(let i = 0; i < count; i++) {
            const lat = Math.random() * 180 - 90;
            const lng = Math.random() * 360 - 180;

            const geoJson = {
                "type": "Feature",
                "properties": {
                    "id": i,
                    "name": `Point ${i}`
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        lng,
                        lat
                    ]
                }
            };

            data.push(geoJson);
        }
        return data;
    }
}