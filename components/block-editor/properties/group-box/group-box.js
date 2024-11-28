export default class GroupBox extends crsbinding.classes.BindableElement {
    static tagName = "group-box-editor";

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
        linkElement.href = new URL("./group-box.css", import.meta.url);

        this.shadowRoot.insertBefore(linkElement, this.shadowRoot.firstChild);
    }

    setWidget(widgetElement, widgetData, schemaId) {
        this.#schemaId = schemaId;
        this.#widgetElement = widgetElement;
        this.#widgetData = widgetData;

        const updateElement = this.#widgetElement.querySelector("[data-property='title']");
        this.setProperty("title", updateElement.textContent);
    }

    async titleChanged(newValue) {
        const updateElement = this.#widgetElement.querySelector("[data-property='title']");
        updateElement.textContent = newValue;

        const path = this.#widgetElement.dataset.path;

        await crsbinding.events.emitter.emit("schema-actions", {
            action: "update",
            args: [this.#schemaId, path, {
                element: this.#widgetElement.tagName.toLowerCase(),
                title: newValue
            }]
        })

        const hostElement = this.getRootNode().host;
        hostElement.dispatchEvent(new CustomEvent("update"));
    }
}

customElements.define(GroupBox.tagName, GroupBox);