class MarkdownViewer extends crsbinding.classes.BindableElement {
    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async close() {
        this.parentElement.removeChild(this);
    }

    async set_markdown(title, markdown, parameters = null) {
        this.setProperty("title", title);

        const html = await crs.call("markdown", "to_html", { markdown, parameters });
        this.article.innerHTML = html;

        if (markdown.indexOf("&{") != -1) {
            await crsbinding.translations.parseElement(this.article);
        }
    }
}

customElements.define("markdown-viewer", MarkdownViewer);