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

    async #widgetSelected(event) {
        console.log(event);
    }
}

customElements.define("block-properties", BlockProperties);