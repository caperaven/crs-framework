import {BlockEditor} from "../../components/block-editor/block-editor.js";
import {CanvasManager} from "../../components/block-editor/canvas-manager.js";
import "./../../components/block-editor/block-properties/block-properties.js";
import {SchemaManager} from "../../src/schema/schema-manager.js";
import {LayoutProvider} from "../../src/schema/providers/layout.js";
import {GroupBoxProvider} from "../../src/schema/providers/group-box.js";
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
    #onUpdateHandler = this.#onUpdate.bind(this);

    async connectedCallback() {
        await super.connectedCallback();
        this.#schemaManager = new SchemaManager();
        this.#schemaManager.registerProvider(LayoutProvider);
        this.#schemaManager.registerProvider(GroupBoxProvider);
        this.#schemaManager.registerSchema("my-schema", this.#schema);

        this.#blockEditor = new BlockEditor("my-schema");
        this.#blockEditor.addEventListener("update", this.#onUpdateHandler);
        this.#canvasManager = new CanvasManager(this.element.querySelector(".canvas"));
    }

    async disconnectedCallback() {
        this.#blockEditor.removeEventListener("update", this.#onUpdateHandler);
        this.#onUpdateHandler = null;
        this.#schemaManager.unregisterSchema("my-schema");
        this.#schemaManager = this.#schemaManager.dispose();
        this.#blockEditor = this.#blockEditor.dispose();
        this.#canvasManager = this.#canvasManager.dispose();
    }

    #onUpdate() {
        const schema = this.#schemaManager.get("my-schema");
        this.element.querySelector(".column3").textContent = JSON.stringify(schema, null, 4);
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