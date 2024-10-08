import "./../../components/interactive-map/interactive-map-actions.js";
import "./../../components/interactive-map/interactive-map.js";
import "../../components/toast-notification/toast-notification-actions.js";
import "../../src/managers/data-manager/data-manager-actions.js";
import "../../components/expanding-input/expanding-input.js";

export default class Map extends crsbinding.classes.ViewBase {

    #toastHandler = this.#toast.bind(this);

    async connectedCallback() {
        globalThis.translations = globalThis.translations || {};
        globalThis.translations.labels = {
            accept: "Accept",
            cancel: "Cancel"
        }
        globalThis.translations.interactiveMap = {
            enterCoordinates: "Enter co-ordinates here",
            invalidCoordinates: "Please enter valid GPS co-ordinates",
            maxShapesReached: "Maximum number of shapes reached. Please delete a shape before adding a new one.",
            content: "Are you sure you want to remove the location?",
            header: "Remove Location"
        }
        await crs.call("toast_notification", "enable", { position: "bottom-center", margin: 10 });

        await crsbinding.events.emitter.on("toast", this.#toastHandler);

        await super.connectedCallback();

        await crs.call("data_manager", "register", {
            manager: "my_data",
            id_field: "id",
            type: "memory",
            request_callback: async (request) => {
                const polygons =  await this.#generateRandomPolygonsGeoJson(2);
                const points = await this.#generateRandomPointsGeoJson(2);

                const shapes = [...polygons, ...points];

                const data = [];
                for (const shape of shapes) {
                    data.push({
                        id: data.length,
                        name: `Shape ${data.length}`,
                        age: Math.floor(Math.random() * 100),
                        address: `Address ${data.length}`,
                        geographicLocation: shape
                    });
                }

                return data;
            }
        });

        this.setProperty("map", "#openstreetmap");

        await this.mapReady();
    }

    async disconnectedCallback() {
        await crs.call("toast_notification", "disable");
        await crs.call("data_manager", "dispose", {
            manager: "my_data"
        })

        await crsbinding.events.emitter.remove("toast", this.#toastHandler);
        this.#toastHandler = null;
        globalThis.translations.labels = null;
        globalThis.translations.interactiveMap = null;
        super.disconnectedCallback();
    }

    async #toast(event) {
        await crs.call("toast_notification", "show", { message: event.message, severity: event.type});
    }

    async clear() {
        await crs.call("interactive_map", "clear_layers", {
            element: this.getProperty("map")
        });
    }

    async mapReady() {
        requestAnimationFrame(async () => {
            this.setLayerGeoJson();
        });
    }

    async setLayerGeoJson() {
        const element = document.querySelector("#openstreetmap");
        element.enable();
    }

    async #generateRandomPolygonsGeoJson(count) {
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
                        dashArray: '10',
                    },
                    "popupDefinition": {
                        "title": "Reference Entity",
                        "highlightColor": "red",
                        "fields": [
                            { "name": "name", "label": "Name" },
                            { "name": "age", "label": "Age" },
                            "$seperator",
                            { "name": "address", "label": "Address" }
                        ]
                    },
                    "readonly": false,
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

    async #generateRandomPointsGeoJson(count) {
        // Create a random geojson points object for the the provided count

        const data = [];

        for(let i = 0; i < count; i++) {
            const lat = Math.random() * 180 - 90;
            const lng = Math.random() * 360 - 180;

            const geoJson = {
                "type": "Feature",
                "properties": {
                    "id": i,
                    "name": `Point ${i}`,
                    "popupDefinition": {
                        "title": "Reference Entity",
                        "highlightColor": "red",
                        "fields": [
                            { "name": "name", "label": "Name" },
                            { "name": "age", "label": "Age" },
                            "$seperator",
                            { "name": "address", "label": "Address" }
                        ]
                    },

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