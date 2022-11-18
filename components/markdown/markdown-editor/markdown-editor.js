import "../markdown-viewer/markdown-viewer.js";
import "../../text-editor/text-editor.js";

class MarkdownEditor extends HTMLElement {
    #markdown;
    #textEditor;
    #viewer;
    #textChangedHandler = this.#textChanged.bind(this);
    #waiting;
    #lastTime;

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());

        requestAnimationFrame(async () => {
            this.#textEditor = this.shadowRoot.querySelector("text-editor");
            this.#textEditor.addEventListener("change", this.#textChangedHandler);
            this.#viewer = this.shadowRoot.querySelector("markdown-viewer");
        })
    }

    async disconnectedCallback() {
        this.#textEditor.removeEventListener("change", this.#textChangedHandler);
        this.#textEditor = null;
        this.#viewer = null;
        this.#markdown = null;

        await crs.call("css_grid_resize", "dispose", { element: this });
    }

    #checkChange() {
        const timeout = setTimeout(() => {
            clearTimeout(timeout);
            this.#updateHTML();
            this.#waiting = false;
        }, 16)
    }

    async #textChanged(event) {
        if (this.#markdown == event.detail) return;

        this.#markdown = event.detail;

        this.#lastTime = performance.now();

        if (this.#waiting != true) {
            this.#waiting = true;
            await this.#checkChange();
        }
    }

    async #updateHTML() {
        requestAnimationFrame(() => {
            this.#viewer.set_markdown(this.#markdown);
        })
    }
}

customElements.define("markdown-editor", MarkdownEditor);