import {beforeAll, afterAll, afterEach, beforeEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assertExists, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "../../../mockups/init.js";

await init();

const manager = "record_manager";

beforeAll(async () => {
    await import("../../../../src/managers/record-manager/record-manager-actions.js");
});

describe("size manager tests", () => {
    beforeEach(async () => {
        await crs.call("record_manager", "register", {
            manager,
            data: {
                fields:[
                    {
                        name: "firstName",
                        dataType: "string",
                        default: "John",

                        customDefaultValidations: {
                            required: {
                                value: "true"
                            },
                            maxLength: {
                                error: "Too long",
                                value: "12"
                            }
                        },

                        conditionalValidations: [
                            {
                                conditionExpr: "model.permissionTreeCode == 'A21'",
                                validations: {
                                    required: {
                                        error: "My custom notes is required message",
                                        value: "true"
                                    }
                                }
                            }
                        ]
                    },
                    {
                        field: "lastName",
                        dataType: "string",
                        default: "Doe",

                        conditionalDefaults: [
                            {
                                conditionExpr: "model.firstName == 'Jane'",
                                value: "Smith"
                            }
                        ],

                    },
                    {
                        field: "age",
                        dataType: "number",
                        default: 20,

                        conditionalDefaults: [
                            {
                                conditionExpr: "model.firstName == 'Jane' && model.lastName == 'Smith'",
                                value: 25
                            }
                        ],
                    }
                ],
                validations: [
                    {
                        conditionExpr: "model.code == 'Test'",
                        validations: [
                            {
                                condition: "siteCode == 'A11'",
                                error: "site code should be A11",
                            },
                            {
                                condition: "isActive == true",
                                error: "isActive should be true"
                            }
                        ]
                    }
                ]
            }
        })
    })

    afterEach(async () => {
        await crs.call("record_manager", "unregister", { manager })
    })

    it ("initialized", async () => {
        assert(globalThis.recordDefinitions != null);
    });

    it ("create proxy model", async () => {
        const model = await crs.call("record_manager", "create", { manager });
        assertExists(model);
        assertEquals(model.$manager, manager);
        assertEquals(model.firstName, "John");
        assertEquals(model.lastName, "Doe");
        assertEquals(model.age, 20);
    })

    it ("test proxy and conditional defaults", async () => {
        const model = await crs.call("record_manager", "create", { manager });
        assertExists(model);
        assertEquals(model.firstName, "John");
        assertEquals(model.lastName, "Doe");
        assertEquals(model.age, 20);

        model.firstName = "Jane";
        assertEquals(model.firstName, "Jane");
        assertEquals(model.lastName, "Smith");
        assertEquals(model.age, 25);
    })
});