import {ElementMock, mockElement} from "./element.mock.js"
import {DocumentMock} from "./dom-mock.js";
import {ComputedStyleMock} from "./computed-style-mock.js";

globalThis.HTMLElement = ElementMock;
globalThis.HTMLInputElement = ElementMock;
globalThis.mockElement = mockElement;
globalThis.elementRegistry = {}

globalThis.requestAnimationFrame = (callback) => callback();
globalThis.getComputedStyle = (element) => {
    return new ComputedStyleMock(element);
}

export async function initRequired() {
    globalThis.HTMLElement = ElementMock;
    globalThis.DocumentFragment = ElementMock;

    globalThis.customElements = {
        define: (id, className, options) => globalThis.elementRegistry[id] = className
    }

    globalThis.document = new DocumentMock();
    globalThis.document.body = {
        dataset: {}
    }

    await import("./../../packages/crs-binding/crs-binding.js");
    await import("./../../packages/crs-modules/crs-modules.js");
    const processModule = await import("./../../packages/crs-process-api/crs-process-api.js");
    await processModule.initialize("./../../packages/crs-process-api");
}