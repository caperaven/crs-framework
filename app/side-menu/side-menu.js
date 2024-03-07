import "/components/side-menu/side-menu.js";

export default class SideMenu extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async connectedCallback() {
        await super.connectedCallback();
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
    }
}