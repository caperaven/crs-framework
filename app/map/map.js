import "./../../components/interactive-map/interactive-map-actions.js";
import "./../../components/interactive-map/interactive-map.js";
import "../../components/toast-notification/toast-notification-actions.js";
import "../../src/managers/data-manager/data-manager-actions.js";

export default class Map extends crsbinding.classes.ViewBase {

    async preLoad() {

    }

    async connectedCallback() {
        await super.connectedCallback();

        await crs.call("data_manager", "register", {
            manager: "my_data",
            id_field: "id",
            type: "memory",
        });


        this.setProperty("map", "#openstreetmap");

        await this.mapReady();
    }

    async clear() {
        await crs.call("interactive_map", "clear_layers", {
            element: this.getProperty("map")
        });
    }


    async mapReady() {

        await crs.call("interactive_map", "initialize", { element: "#openstreetmap"});

        await crs.call("interactive_map", "show_drawing_tools", {
            element: "#openstreetmap"
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
                    "style": {
                        fillColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
                        color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
                        weight: Math.floor(Math.random() * 10),
                        dashArray: '10'
                    }
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