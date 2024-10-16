import {DataPipeline} from "../../../src/managers/data-pipeline/data-pipeline.js";

class TestComponent extends crsbinding.classes.BindableElement {
    #loadingPipeline;
    #loadedHandler = this.#loaded.bind(this);

    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get data() {
        return this.getProperty("data");
    }

    set data(newValue) {
        this.setProperty("data", newValue);
        this.#loadingPipeline.setPropertyValue("hasData", true);
    }


    preLoad() {
        this.setProperty("status", "waiting");
        this.#loadingPipeline = new DataPipeline();
        this.#loadingPipeline.addIntent(this.#loadedHandler);
        this.#loadingPipeline.addPropertySlot("hasData");
        this.#loadingPipeline.addAttributeSlot("dataId", this, "data-id");
        this.#loadingPipeline.activate();
    }

    #loaded(slots) {
        this.setProperty("status", "done");
        this.#loadingPipeline = this.#loadingPipeline.dispose();
    }
}

customElements.define("pipline-test", TestComponent);