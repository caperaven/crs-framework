import {assertEquals, beforeAll, beforeEach, describe, it, assert} from "../../../dependencies.js";
import {init} from "../../../mockups/init.js";

await init();

describe("Layout", () => {
    beforeAll(async () => {
        await import("./../../../../components/kan-ban/cards-manager/cards-manager-actions.js");
    });

    it ("startup", async () => {
        assert(crs.cardsManager != null);
        assert(crs.intent.cards_manager != null);
    })
});