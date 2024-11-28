export default class BlockProperties extends crsbinding.classes.BindableElement {
    #widgetSelectedHandler = this.#widgetSelected.bind(this);

    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html")
    }

    async connectedCallback() {
        await super.connectedCallback();
        await crsbinding.events.emitter.on("widget-selected", this.#widgetSelectedHandler);
    }

    onHTML() {
        const linkElement = document.createElement("link");
        linkElement.rel = "stylesheet";
        linkElement.href = new URL("./block-properties.css", import.meta.url);

        this.shadowRoot.insertBefore(linkElement, this.shadowRoot.firstChild);
    }

    async #widgetSelected(event) {
        const { schemaId, widgetId, element } = event;
        const { widget, tagName } = await crsbinding.events.emitter.emit("getWidgetProperties", { id: widgetId });
        const propertiesElement = document.createElement(tagName);
        propertiesElement.setWidget(element, widget, schemaId);

        this.shadowRoot.innerHTML = "";
        this.shadowRoot.appendChild(propertiesElement);
    }
}

customElements.define("block-properties", BlockProperties);