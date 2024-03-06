import { beforeAll, beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";
import {stub} from "https://deno.land/std@0.157.0/testing/mock.ts";


await init();
let instance, inputLabelMock, inputMock, mainLabelMock, fileSizeLabelMock, dispatchStub

async function createInstance() {
    instance = document.createElement("file-uploader");

    inputLabelMock = document.createElement("label");
    inputMock = document.createElement("input");

    inputLabelMock.id = "btn-upload";
    inputLabelMock.setAttribute("for", "inp-upload");
    inputMock.id = "inp-upload";

    mainLabelMock = document.createElement("label");
    fileSizeLabelMock = document.createElement("label");

    mainLabelMock.id = "lbl-main";
    fileSizeLabelMock.id = "lbl-file-size";

    const replaceButtonMock = document.createElement("button");
    const downloadButtonMock = document.createElement("button");
    const deleteButtonMock = document.createElement("button");

    replaceButtonMock.id = "btn-replace";
    downloadButtonMock.id = "btn-download";
    deleteButtonMock.id = "btn-delete";

    replaceButtonMock.dataset.action =  "replace";
    downloadButtonMock.dataset.action =  "download";
    deleteButtonMock.dataset.action =  "delete";

    instance.shadowRoot.appendChild(inputLabelMock);
    instance.shadowRoot.appendChild(inputMock);
    instance.shadowRoot.appendChild(mainLabelMock);
    instance.shadowRoot.appendChild(fileSizeLabelMock);
    instance.shadowRoot.appendChild(replaceButtonMock);
    instance.shadowRoot.appendChild(downloadButtonMock);
    instance.shadowRoot.appendChild(deleteButtonMock);
}

async function initInstance(fileName, fileSize, fileType) {
    await crs.call("file_uploader_component", "initialize", {
        element: instance,
        file_name: fileName,
        file_extension: fileType,
        file_size: fileSize
    });
}

beforeAll(async () => {
    await import("../../../components/file-uploader/file-uploader.js")
    await import("../../../components/file-uploader/file-uploader-actions.js");

    globalThis.translations ||= {};
    globalThis.translations.fileUploader = {
        "upload": "Upload File",
        "dragDrop": "Or drag and drop a file here",
        "fileSize": "File Size",
        "replace": "Replace",
        "download": "Download",
        "delete": "Delete"
    }
})

describe ("file-uploader initialisation tests", async () => {
    beforeEach(async () => {
        await createInstance();
        dispatchStub = stub(instance, "dispatchEvent", (event) => {});
    })

    afterEach(async () => {
        await instance.disconnectedCallback();
        dispatchStub.restore();
    })

    it ("initializes file-uploader component in the correct 'upload' state", async () => {
        //act
        await instance.connectedCallback();
        await initInstance()

        //assert
        assertEquals(instance != null, true);
        assertEquals(instance.dataset.state, "upload");
        assertEquals(instance.__events.length, 1);
        assertEquals(inputMock.__events.length, 1);
    });

    it ("initializes file-uploader component with correct labels set", async () => {
        //act
        await instance.connectedCallback();
        await initInstance('test_file',3000, 'pdf')

        //assert
        assertEquals(instance != null, true);
        assertEquals(instance.dataset.state, "uploaded");
        assertEquals(instance.dataset.fileName, "test_file");
        assertEquals(instance.dataset.fileSize, 3000);
        assertEquals(instance.dataset.fileType, "pdf");
        assertEquals(instance.__events.length, 1);
        assertEquals(inputMock.__events.length, 1);

        assertEquals(mainLabelMock.innerText, "test_file.pdf");
        assertEquals(fileSizeLabelMock.innerText, "3Kb");
    });
});

describe ("file-uploader updating attributes and properties", async () => {
    beforeEach(async () => {
        await createInstance();
        dispatchStub = stub(instance, "dispatchEvent", (event) => {});

        await instance.connectedCallback()
    })

    afterEach(async () => {
        await instance.disconnectedCallback();
        dispatchStub.restore();
    })

    it ("updating labels sets the correct file size to 1Kb", async () => {
        //arrange
        await initInstance('test_file', 1000, 'pdf');

        //act
        await instance.updateLabels();

        //assert
        assertEquals(fileSizeLabelMock.innerText, "1Kb");
    })

    it ("updating labels sets the correct file size to 1.00Mb", async () => {
        //arrange
        await initInstance('test_file', 1048576, 'pdf');

        //act
        await instance.updateLabels();

        //assert
        assertEquals(fileSizeLabelMock.innerText, "1.00Mb");
    })

    it ("updating labels sets the correct file size to 1.00Gb", async () => {
        //arrange
        await initInstance('test_file', 1073741824, 'pdf');

        //act
        await instance.updateLabels();

        //assert
        assertEquals(fileSizeLabelMock.innerText, "1.00Gb");
    })

    it ("updating labels sets the correct file size to 1.00Tb", async () => {
        //arrange
        await initInstance('test_file', 1099511627776, 'pdf');

        //act
        await instance.updateLabels();

        //assert
        assertEquals(fileSizeLabelMock.innerText, "1.00Tb");
    })

    it ("updating labels sets the correct file name to another_test_file.pdf when fileType does not start with a .", async () => {
        //arrange
        await initInstance('another_test_file', 1000, 'pdf');

        //act
        await instance.updateLabels();

        //assert
        assertEquals(mainLabelMock.innerText, "another_test_file.pdf");
    })

    it ("updating labels sets the correct file name to another_test_file.pdf when fileType does start with a .", async () => {
        //arrange
        await initInstance('another_test_file', 1000, '.pdf');

        //act
        await instance.updateLabels();

        //assert
        assertEquals(mainLabelMock.innerText, "another_test_file.pdf");
    })

    it ("updating labels sets the correct file name to another_test_file.pdf.txt when fileType does start with a . but ends with .txt", async () => {
        //arrange
        await initInstance('another_test_file', 1000, 'pdf.txt');

        //act
        await instance.updateLabels();

        //assert
        assertEquals(mainLabelMock.innerText, "another_test_file.pdf.txt");
    })
});

describe ("file-uploader events", async () => {
    let file;

    beforeEach(async () => {
        await createInstance();
        dispatchStub = stub(instance, "dispatchEvent", (event) => {});
        await instance.connectedCallback();
        file = {
            name: "test_file.pdf",
            type: "application/pdf",
            size: "3000"
        };
    })

    afterEach(async () => {
        await instance.disconnectedCallback();
        await dispatchStub.restore();
    })

    it ("change event dispatched on the input uploads the file", async () => {
        //arrange
        inputMock.files = [file];
        await dispatchStub.restore();
        dispatchStub = stub(instance, "dispatchEvent", (event) => {
            assertEquals(event.type, "upload_file");
            assertEquals(event.detail.file.name, "test_file");
            assertEquals(event.detail.file.ext, "pdf");
            assertEquals(event.detail.file.type, "application/pdf");
            assertEquals(event.detail.file.size, "3000");
            assertEquals(event.detail.file.value, file);
        });

        //act
        await inputMock.dispatchEvent(new Event("change"));

        //assert
        assertEquals(dispatchStub.calls.length, 1);
        assertEquals(instance.dataset.state, "uploading");
        assertEquals(instance.dataset.fileName, "test_file");
        assertEquals(instance.dataset.fileType, "pdf");
        assertEquals(instance.dataset.fileSize, "3000");
        assertEquals(mainLabelMock.innerText, "test_file.pdf");
        assertEquals(fileSizeLabelMock.innerText, "3Kb");
    })

    it ("clicking the replace button dispatches the replace_file event", async () => {
        //arrange
        instance.file = "some_file";
        const event = {
            composedPath: () => {
                return [instance.shadowRoot.querySelector("#btn-replace")];
            }
        }
        await dispatchStub.restore();
        dispatchStub = stub(instance, "dispatchEvent", (event) => {
            assertEquals(event.type, "replace_file");
        });

        //act
        await instance.__events[0].callback(event);

        //assert
        assertEquals(dispatchStub.calls.length, 1);
    })

    it ("clicking the download button dispatches the download_file event", async () => {
        //arrange
        inputMock.files = [file];
        const event = {
            composedPath: () => {
                return [instance.shadowRoot.querySelector("#btn-download")];
            }
        }
        await dispatchStub.restore();
        dispatchStub = stub(instance, "dispatchEvent", (event) => {
            assertEquals(event.type, "download_file");
            assertEquals(event.detail.file.name, "test_file.pdf");
            assertEquals(event.detail.file.type, "application/pdf");
            assertEquals(event.detail.file.size, "3000");
        });

        //act
        await instance.__events[0].callback(event);

        //assert
        assertEquals(dispatchStub.calls.length, 1);
    })

    it ("clicking the delete button dispatches the delete_file event", async () => {
        //arrange
        inputMock.files = [file];
        const event = {
            composedPath: () => {
                return [instance.shadowRoot.querySelector("#btn-delete")];
            }
        }
        await dispatchStub.restore();
        dispatchStub = stub(instance, "dispatchEvent", (event) => {
            assertEquals(event.type, "delete_file");
            assertEquals(event.detail.file.name, "test_file.pdf");
            assertEquals(event.detail.file.type, "application/pdf");
            assertEquals(event.detail.file.size, "3000");
        });

        //act
        await instance.__events[0].callback(event);

        //assert
        assertEquals(dispatchStub.calls.length, 1);
    })
});

describe ("file-uploader-actions tests", async () => {
    beforeEach(async () => {
        await createInstance();
        dispatchStub = stub(instance, "dispatchEvent", (event) => {});
        await instance.connectedCallback();
    })

    afterEach(async () => {
        await instance.disconnectedCallback();
        await dispatchStub.restore();
    })

    it ("get_file - returns the file associated with the element", async () => {
        //arrange
        inputMock.files = ["test_file"];

        //act
        const file = await crs.call("file_uploader_component", "get_file", {element: instance})

        //assert
        assertEquals(file, "test_file");
    })

    it ("file_uploaded - calls upon the file-uploader's uploaded() to update the state", async () => {
        //arrange
        instance.dataset.state = "uploading";

        //act
        await crs.call("file_uploader_component", "file_uploaded", {element: instance});

        //assert
        assertEquals(instance.dataset.state, "uploaded");
    })

    it ("file_deleted - calls upon the file-uploader's deleted() to update the state and input value", async () => {
        //arrange
        await initInstance('test_file', 1000, 'pdf');
        inputMock.value = ["test_file"];

        //act
        await crs.call("file_uploader_component", "file_deleted", {element: instance});

        //assert
        assertEquals(instance.dataset.state, "upload");
        assertEquals(inputMock.value, null);
    })

    it ("uploading_file - updates the file-uploader component with the new file's details", async () => {
        //arrange
        inputMock.value = ["test_file"];
        await initInstance('test_file', 3000, 'pdf');

        //act
        await crs.call("file_uploader_component", "uploading_file", {
            element: instance,
            file: {
                name: "new_file",
                type: "docx",
                size: "5120"
            },
            file_name: "new_file",
            file_extension: "docx"
        });

        //assert
        assertEquals(instance.dataset.state, "uploading");
        assertEquals(instance.dataset.fileName, "new_file");
        assertEquals(instance.dataset.fileType, "docx");
        assertEquals(instance.dataset.fileSize, "5120");
        assertEquals(mainLabelMock.innerText, "new_file.docx");
        assertEquals(fileSizeLabelMock.innerText, "5Kb");
    })

    it ("file_replaced - calls upon the file-uploader's uploaded() to update the state and file", async () => {
        //arrange
        instance.dataset.state = "uploading";

        //act
        await crs.call("file_uploader_component", "file_replaced", {
            element: instance,
            file: "new_file"
        });

        //assert
        assertEquals(instance.dataset.state, "uploaded");
    })
});