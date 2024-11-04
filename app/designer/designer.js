import {BlockEditor} from "../../components/block-editor/block-editor.js";
import {CanvasManager} from "../../components/block-editor/canvas-manager.js";

export default class DataManagerIdb extends crsbinding.classes.ViewBase {
    #blockEditor;
    #canvasManager;

    async connectedCallback() {
        await super.connectedCallback();
        this.#blockEditor = new BlockEditor();
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