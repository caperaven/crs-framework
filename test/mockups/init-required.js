import {ElementMock} from "./element.mock.js"
import {DocumentMock} from "./dom-mock.js";

globalThis.HTMLElement = ElementMock;
globalThis.HTMLInputElement = ElementMock;

globalThis.customElements = {
    define(id, className, options) {
    }
}

export async function initRequired() {
    globalThis.HTMLElement = ElementMock;
    globalThis.DocumentFragment = ElementMock;

    globalThis.customElements = {
        define: () => {return null}
    }

    globalThis.document = new DocumentMock();
    globalThis.document.body = {
        dataset: {}
    }

    await import("./../../packages/crs-binding/crs-binding.js");
    await import("./../../packages/crs-modules/crs-modules.js");
}