export default class ContentEditable extends crsbinding.classes.BindableElement {
    static tagName = "content-editable-editor";

    #widgetData;
    #widgetElement;

    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html")
    }

    onHTML() {
        const linkElement = document.createElement("link");
        linkElement.rel = "stylesheet";
        linkElement.href = new URL("./content-editable.css", import.meta.url);

        this.shadowRoot.insertBefore(linkElement, this.shadowRoot.firstChild);
    }

    setWidget(widgetElement, widgetData) {
        this.#widgetElement = widgetElement;
        this.#widgetData = widgetData;

        this.setProperty("content", this.#widgetElement.textContent);
    }

    contentChanged(newValue) {
        this.#widgetElement.textContent = newValue;
    }
}

customElements.define(ContentEditable.tagName, ContentEditable);