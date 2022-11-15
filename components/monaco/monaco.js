const ids = Object.freeze({
    REQUIRE_JS: "require_js",
    MONACO_CSS: "monaco_css"
})

export class MonacoEditor extends HTMLElement {
    async connectedCallback() {
        await loadRequireJs();
        await loadCSS(this);
    }

    async disconnectedCallback() {
        await crs.call("scripts", "unload_file", { id: ids.REQUIRE_JS });
        await crs.call("styles", "unload_file", { id: ids.MONACO_CSS });
    }
}

customElements.define("monaco-editor", MonacoEditor);

async function loadRequireJs() {
    const id = ids.REQUIRE_JS;
    const file = import.meta.url.replace("monaco.js", "require.js");
    await crs.call("scripts", "load_file", { id, file })
}

async function loadCSS(element) {
    const id = ids.MONACO_CSS;
    const file = import.meta.url.replace("monaco.js", "package/min/vs/editor/editor.main.css");
    await crs.call("styles", "load_file", { id, file });
    await crs.call("dom", "set_styles", {
        element,
        styles: {
            display: "block",
            width: "100%",
            height: "100%"
        }
    })
}