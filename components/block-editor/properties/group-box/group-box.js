export default class TabSheetEditor extends crsbinding.classes.BindableElement {
    static tagName = "tab-sheet-editor";

    #schemaId;
    #widgetData;
    #widgetElement;

    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html")
    }


    preLoad() {
        this.setProperty("title", "Group Box");
    }

    onHTML() {
        const linkElement = document.createElement("link");
        linkElement.rel = "stylesheet";
        linkElement.href = new URL("./tab-sheet.css", import.meta.url);

        this.shadowRoot.insertBefore(linkElement, this.shadowRoot.firstChild);
    }

    setWidget(widgetElement, widgetData, schemaId) {
        this.#schemaId = schemaId;
        this.#widgetElement = widgetElement;
        this.#widgetData = widgetData;
    }
}

customElements.define(TabSheetEditor.tagName, TabSheetEditor);