import "./../../components/sla-visualization/sla-measurement/sla-measurement.js";

export default class TestCssGrid extends crs.classes.BindableElement {

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
    }
}