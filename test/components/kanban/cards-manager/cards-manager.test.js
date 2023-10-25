import {assertEquals, beforeAll, beforeEach, describe, it, assert} from "../../../dependencies.js";
import {init} from "../../../mockups/init.js";

await init();

const card = `<div>__name__</div>`;

describe("Layout", () => {
    beforeAll(async () => {
        await import("./../../../../components/kan-ban/cards-manager/cards-manager-actions.js");
    });

    it ("startup", async () => {
        assert(crs.cardsManager != null);
        assert(crs.intent.cards_manager != null);
    })

    it ("register", async () => {
        await crs.call("cards_manager", "register", {
            "name": "test",
            "card": card
        })

        assertEquals(crs.cardsManager.cards["test"], card);
    })

    it ("unregister", async () => {
        await crs.call("cards_manager", "register", {
            "name": "test",
            "card": card
        })

        assertEquals(crs.cardsManager.cards["test"], card);

        await crs.call("cards_manager", "unregister", {
            "name": "test"
        });

        assertEquals(crs.cardsManager.cards["test"], undefined);
    })

    it ("create", async () => {
        await crs.call("cards_manager", "register", {
            "name": "test",
            "card": card
        })

        const result = await crs.call("cards_manager", "create", {
            "name": "test",
            "data": [{ name: "John" }, { name: "Jane" }]
        });

        assertEquals(result.length, 2);
    })
});