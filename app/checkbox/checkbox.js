import "/components/checkbox/checkbox.js";

export default class Checkbox extends crs.binding.classes.ViewBase {
    async preLoad() {
        this.setProperty("isActive", true);
        this.setProperty("isTrue", null);
    }

    async mixed() {
        this.cbMixed.checked = "mixed";
    }
}