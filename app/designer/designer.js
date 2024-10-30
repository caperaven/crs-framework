import {BlockEditor} from "../../components/block-editor/block-editor.js";

export default class DataManagerIdb extends crsbinding.classes.ViewBase {
    #blockEditor;

    async connectedCallback() {
        await super.connectedCallback();
        this.#blockEditor = new BlockEditor();
    }

    async showWidgets() {
        await this.#blockEditor.showWidgetLibrary()
    }
}