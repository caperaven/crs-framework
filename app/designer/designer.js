import {BlockEditor} from "../../components/block-editor/block-editor.js";
import {CanvasManager} from "../../components/block-editor/canvas-manager.js";
import "./../../components/block-editor/block-properties/block-properties.js";
import {SchemaManager} from "../../src/schema/schema-manager.js";
import {LayoutProvider} from "../../src/schema/providers/layout.js";


export default class DataManagerIdb extends crsbinding.classes.ViewBase {
    #blockEditor;
    #canvasManager;
    #schemaManager;
    #schema = {
        "id": "my-schema",

        "body": {
            "elements": []
        }
    };

    async connectedCallback() {
        await super.connectedCallback();
        this.#schemaManager = new SchemaManager("designer");
        this.#schemaManager.registerProvider(LayoutProvider);
        this.#schemaManager.registerSchema(this.#schema);

        this.#blockEditor = new BlockEditor("my-schema");
        this.#canvasManager = new CanvasManager(this.element.querySelector(".canvas"));
    }

    async disconnectedCallback() {
        this.#blockEditor = this.#blockEditor.dispose();
        this.#canvasManager = this.#canvasManager.dispose();
    }

    async showWidgets() {
        await this.#blockEditor.showWidgetLibrary()
    }
}