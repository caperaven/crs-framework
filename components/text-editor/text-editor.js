import {EditorView, basicSetup, markdown} from "./editor.js";

class TextEditor extends HTMLElement {
    async connectedCallback() {
        const editor = new EditorView({
            extensions: [basicSetup, markdown()],
            parent: this
        })
    }
}

customElements.define("text-editor", TextEditor);