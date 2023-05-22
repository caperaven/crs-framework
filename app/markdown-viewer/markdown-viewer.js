import "../../components/markdown/markdown-viewer/markdown-viewer-actions.js"

export default class MarkdownViewer extends crs.binding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    preLoad() {
        crs.binding.translations.add({
            hello: "Hello",
            world: "World"
        }, "md")
    }

    async set() {
        const content = await fetch(import.meta.url.replace(".js", ".md")).then(result => result.text());
        await crs.call("markdown_viewer", "set_markdown", {
            element: this.viewer,
            markdown: content,
            parameters: {code: "A11"}
        })
    }
}

