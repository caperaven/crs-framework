export default class BlockProperties extends crsbinding.classes.BindableElement {
    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html")
    }
}

customElements.define("block-properties", BlockProperties);