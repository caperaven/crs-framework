export default class ContentEditable extends crsbinding.classes.BindableElement {
    static tagName = "content-editable-editor";

    #schemaId;
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

    setWidget(widgetElement, widgetData, schemaId) {
        this.#schemaId = schemaId;
        this.#widgetElement = widgetElement;
        this.#widgetData = widgetData;

        this.setProperty("content", this.#widgetElement.textContent);
    }

    async contentChanged(newValue) {
        this.#widgetElement.textContent = newValue;
        const path = this.#widgetElement.dataset.path;

        await crsbinding.events.emitter.emit("schema-actions", {
            action: "update",
            args: [this.#schemaId, path, {
                element: this.#widgetElement.tagName.toLowerCase(),
                content: newValue
            }]
        })

        const hostElement = this.getRootNode().host;
        hostElement.dispatchEvent(new CustomEvent("update"));
    }
}

customElements.define(ContentEditable.tagName, ContentEditable);