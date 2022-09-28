import {ElementMock, mockElement} from "./element.mock.js";

export class DocumentMock {
    createElement(tag) {
        if (globalThis.elementRegistry[tag] != null) {
            return mockElement(new globalThis.elementRegistry[tag]());
        }
        return new ElementMock(tag);
    }

    createDocumentFragment() {
        return new ElementMock();
    }

    querySelector(query) {
    }
}