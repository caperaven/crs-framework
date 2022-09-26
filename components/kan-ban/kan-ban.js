export default class KanBan extends crsbinding.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }
}

customElements.define("kan-ban", KanBan);