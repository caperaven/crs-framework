import "/components/checkbox/checkbox.js";

export default class Checkbox extends crsbinding.classes.ViewBase {

    async connectedCallback() {
        await super.connectedCallback();
    }

    async preLoad() {
        this.setProperty("isActive", true);
        this.setProperty("isCorrect", false);
        this.setProperty("isTrue", "mixed");
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
    }

}