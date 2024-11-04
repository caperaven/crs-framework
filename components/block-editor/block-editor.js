import "./block-widgets/block-widgets.js";
import "./block-properties/block-properties.js";
import {DragDropManager} from "./drag-drop-manager.js";

/**
 * @class BlockEditor
 * @description This is the master class for block editor functionality.
 * Block editing has a number of moving parts, each with its own responsibility.
 * What we need is a central class that will delegate between the parts and provide the
 * data management required for block editing.
 */
export class BlockEditor extends EventTarget {
    #ready = false;
    #widgetLibraryData;
    #widgetLibraryHandler = this.#widgetLibrary.bind(this);
    #dragDropManager = new DragDropManager();

    get ready() {
        return this.#ready;
    }

    constructor() {
        super();
        this.init().catch(error => { throw new Error(error); });
    }

    dispose() {
        crsbinding.events.emitter.remove("getWidgetLibrary", this.#widgetLibraryHandler);
        this.#widgetLibraryData = null;
        this.#widgetLibraryHandler = null;
        this.#dragDropManager = this.#dragDropManager.dispose();
    }

    async init() {
        this.#widgetLibraryData = await loadWidgetLibrary();
        await this.#initEvents();

        this.#ready = true;
        this.dispatchEvent(new CustomEvent("ready"));
    }

    async #initEvents() {
        await crsbinding.events.emitter.on("getWidgetLibrary", this.#widgetLibraryHandler);
    }

    async #widgetLibrary() {
        return this.#widgetLibraryData;
    }

    async showWidgetLibrary() {
        await crs.call("dialog", "show", {
            title: "Widget Library",
            main: document.createElement("block-widgets"),
            allowResize: true,
            allowMove: true
        })
    }

    async hideWidgetLibrary() {
        console.log("hide the widget library floating dialog")
    }

    async showProperties() {
        console.log("show the properties panel")
    }

    async hideProperties() {
        console.log("hide the properteis")
    }
}

/**
 * In the same folder as this file is a wdiget-library.json file that contains the
 * widget library data. This function will load that data and store it in the
 * widgetLibrary property. This data will be used to populate the block editor
 * with the available widgets. This function just loads the data.
 * @returns {Promise<void>}
 */
async function loadWidgetLibrary() {
    const url = new URL('./widget-library.json', import.meta.url);
    return await fetch(url).then(result => result.json());
}