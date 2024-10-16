import "./test-component/test-component.js";

export default class DataPipeline extends crsbinding.classes.ViewBase {
    updateAttribute() {
        const element = this._element.querySelector("pipline-test");
        element.dataset.id = "my test value";
    }

    updateData() {
        const element = this._element.querySelector("pipline-test");
        element.data = { id: 1, name: "my name" };
    }
}