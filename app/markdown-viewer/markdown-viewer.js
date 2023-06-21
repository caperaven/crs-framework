import "../../components/markdown/markdown-viewer/markdown-viewer-actions.js"
import AvailableSelectedViewModel from "../available-selected/available-selected.js";

export default class MarkdownViewerViewModel extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
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

