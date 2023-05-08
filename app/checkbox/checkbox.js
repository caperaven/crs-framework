import "/components/checkbox/checkbox.js";

export default class Checkbox extends crsbinding.classes.ViewBase {

    async connectedCallback() {
        await super.connectedCallback();
    }

    async preLoad() {
        this.setProperty("isActive", true);
        this.setProperty("isTrue", null);
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
    }

    async mixed() {
        this.cbMixed.checked = "mixed";
    }
}