import {EditorView, basicSetup, markdown} from "./editor.js";

class TextEditor extends HTMLElement {
    #editor;
    #value;

    get value() {
        return this.#value;
    }

    set value(newValue) {
        this.#value = newValue;

        if (this.#editor != null) {
            this.#setValue(newValue);
        }
    }

    async connectedCallback() {
        this.#editor = new EditorView({
            extensions: [basicSetup, markdown()],
            parent: this
        })

        if (this.#value != null) {
            this.#setValue(this.#value);
        }
    }

    async disconnectedCallback() {
        this.#editor = this.#editor.dispose();
    }

    #setValue(text) {
        this.#editor.dispatch({
            changes: {from: 0, to: this.#editor.state.doc.length, insert: text}
        });
    }

    #getValue() {
        if (this.#editor == null) return "";
        return this.#editor.state.doc.toString();
    }
}

customElements.define("text-editor", TextEditor);