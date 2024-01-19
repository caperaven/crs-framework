import {assertEquals, beforeAll, beforeEach, describe, it, assert} from "../../../dependencies.js";
import {init} from "../../../mockups/init.js";
import {ElementMock} from "../../../mockups/element-mock.js";

await init();

const template = {};

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
            "template": template
        })

        assertEquals(crs.cardsManager.cards["test"].template, template);
    })

    it ("unregister", async () => {
        await crs.call("cards_manager", "register", {
            "name": "test",
            "template": template
        })

        assertEquals(crs.cardsManager.cards["test"].template, template);

        await crs.call("cards_manager", "unregister", {
            "name": "test"
        });

        assertEquals(crs.cardsManager.cards["test"], undefined);
    })

    it ("get", async () => {
        await crs.call("cards_manager", "register", {
            "name": "test",
            "template": template
        })

        const result = await crs.call("cards_manager", "get", {
            "name": "test",
        });

        assertEquals(result.template, template);
    })
});