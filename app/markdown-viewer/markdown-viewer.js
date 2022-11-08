import "./../../components/markdown-viewer/markdown-viewer-actions.js"

export default class MarkdownViewer extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    preLoad() {
        crsbinding.translations.add({
            hello: "Hello",
            world: "World"
        }, "md")
    }

    async set() {
        const content = await fetch(import.meta.url.replace(".js", ".md")).then(result => result.text());
        await crs.call("markdown_viewer", "set_markdown", {
            element: this.viewer,
            markdown: content,
            title: "My Markdown",
            parameters: {code: "A11"}
        })
    }
}

