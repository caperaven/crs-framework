import "/src/binding-extensions/markdown-template.js";
import "/src/binding-extensions/schema-template.js";

export default class TemplateLoading extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }
}