import {BlockEditor} from "../../components/block-editor/block-editor.js";
import {CanvasManager} from "../../components/block-editor/canvas-manager.js";
import "./../../components/block-editor/block-properties/block-properties.js";
import {SchemaManager} from "../../src/schema/schema-manager.js";
import {LayoutProvider} from "../../src/schema/providers/layout.js";
import {ValidationResult} from "../../src/schema/validation-result.js";


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
        this.#schemaManager = new SchemaManager();
        this.#schemaManager.registerProvider(LayoutProvider);
        this.#schemaManager.registerSchema("my-schema", this.#schema);

        this.#blockEditor = new BlockEditor("my-schema");
        this.#canvasManager = new CanvasManager(this.element.querySelector(".canvas"));
    }

    async disconnectedCallback() {
        this.#schemaManager.unregisterSchema("my-schema");
        this.#schemaManager = this.#schemaManager.dispose();
        this.#blockEditor = this.#blockEditor.dispose();
        this.#canvasManager = this.#canvasManager.dispose();
    }

    async showWidgets() {
        await this.#blockEditor.showWidgetLibrary()
    }

    async loadSchema() {
        const module = await import(new URL("./layout-schema.js", import.meta.url));
        const schema = module.schema;

        await this.#schemaManager.registerSchema("loaded", schema);
        const parseResult = await this.#schemaManager.parse("loaded");

        if (ValidationResult.isError(parseResult)) {
            alert(parseResult.message);
        }

        await this.#canvasManager.setHTML(parseResult.message);
    }
}