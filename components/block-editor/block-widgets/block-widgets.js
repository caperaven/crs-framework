export default class BlockWidgets extends crsbinding.classes.BindableElement {
    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html")
    }
}

customElements.define("block-widgets", BlockWidgets);