import {assertEquals, beforeAll, describe, it} from "./../../dependencies.js";

describe("Context Menu", async () => {

    beforeAll(async () => {
        await import("./../../../components/context-menu/context-menu.js");
    });

    it("should show titles and templates", async () => {
        // JHR: the way this tests was being written was assume public properties that don't exist.
        // this needs to be rewritten to be more focused and using the public api.
    });
});