import {ElementMock, mockElement} from "./element-mock.js"

globalThis.document = new ElementMock("document");
globalThis.document.body = new ElementMock("body");
globalThis.document.documentElement = globalThis.document.body;

globalThis.document.createElement = (tag) => {
    if (globalThis.__elementRegistry[tag] != null) {
        return mockElement(new globalThis.__elementRegistry[tag]());
    }
    return new ElementMock(tag);
}

globalThis.document.createTextNode = () => {
    return new ElementMock("text");
}

globalThis.document.createDocumentFragment = () => {
    return new ElementMock();
}
