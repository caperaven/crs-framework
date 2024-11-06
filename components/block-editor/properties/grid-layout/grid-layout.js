export default class GridLayout extends crsbinding.classes.BindableElement {
    static tagName = "grid-layout-editor";

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
        linkElement.href = new URL("./grid-layout.css", import.meta.url);

        this.shadowRoot.insertBefore(linkElement, this.shadowRoot.firstChild);
    }

    setWidget(widgetElement, widgetData) {
        this.#widgetElement = widgetElement;
        this.#widgetData = widgetData;
    }
}

customElements.define(GridLayout.tagName, GridLayout);