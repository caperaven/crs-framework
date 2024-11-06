export default class GroupBox extends crsbinding.classes.BindableElement {
    static tagName = "group-box-editor";

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
        linkElement.href = new URL("./group-box-editor.css", import.meta.url);

        this.shadowRoot.insertBefore(linkElement, this.shadowRoot.firstChild);
    }

    setWidget(widgetElement, widgetData) {
        this.#widgetElement = widgetElement;
        this.#widgetData = widgetData;
    }
}

customElements.define(GroupBox.tagName, GroupBox);