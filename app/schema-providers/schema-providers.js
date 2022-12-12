export default class SchemaProviders extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
    }

    async preLoad() {
        const schema = await fetch(import.meta.url.replace("schema-providers.js", "schema.json")).then(r => r.json());
        const result = await crs.schemaParserManager.parse("html", schema, this);
        this.element.innerHTML = result;
    }

    async click(...args) {
        console.log(args);
    }
}