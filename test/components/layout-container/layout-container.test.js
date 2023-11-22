import {assertEquals, beforeAll, beforeEach, describe, it} from "../../dependencies.js";
import {init} from "../../mockups/init.js";
import {createChildrenFromHtml} from "../../mockups/child-mock-factory.js";


await init();

describe("Layout", () => {
    let instance;

    beforeAll(async () => {
        await import("../../../components/layout-container/layout-container.js");
    });

    beforeEach(async () => {
        instance = document.createElement("layout-container");
    });

    describe("Creating standard grid layouts initial tests", async () => {
        it("should have grid-template-columns and grid-template-rows", async () => {
            //Arrange
            instance.dataset.columns = "1fr 1fr 1fr";
            instance.dataset.rows = "1fr";

            //Act
            await instance.connectedCallback();
            const styles = instance.style;

            //Assert
            assertEquals(styles.gridTemplateColumns, "1fr 1fr 1fr");
            assertEquals(styles.gridTemplateRows, "1fr");
        });

        it("should set not grid-template-rows or grid-template-columns if columns or rows = empty", async () => {
            //Act
            await instance.connectedCallback();
            const styles = instance.style;

            //Assert
            assertEquals(styles.gridTemplateColumns, "");
            assertEquals(styles.gridTemplateRows, "");
        });


        it("should not fail if invalid data-columns values are passed or if values are null", async () => {
            //Arrange
            const expectedRowsValue = "1fr 1fr"
            instance.dataset.columns = null;
            instance.dataset.rows = "1fr 1fr";

            //Act
            await instance.connectedCallback();
            const styles = instance.style;

            //Assert
            assertEquals(styles.gridTemplateRows, expectedRowsValue)
        });

        it("should not fail if invalid data-rows values are passed or if values are null", async () => {
            //Arrange
            const expectedColumnsValue = "1fr 1fr 1fr"
            instance.dataset.columns = "1fr 1fr 1fr";
            instance.dataset.rows = null;

            //Act
            await instance.connectedCallback();
            const styles = instance.style;

            //Assert
            assertEquals(styles.gridTemplateColumns, expectedColumnsValue)
        });

        it("should not fail if invalid data-rows and data-columns values are passed or if values are null", async () => {
            //Arrange
            instance.dataset.columns = null;
            instance.dataset.rows = null;

            //Act
            await instance.connectedCallback();
        });
    });

    describe("hide or show functionality tests", async () => {
        it("should hide the first column of the 3 column grid", async () => {
            //Arrange
            const expectedValue = "0 2fr 1fr";
            instance.dataset.columns = " 1fr 1fr 1fr";
            instance.dataset.rows = "1fr"
            const args = {
                message: "setColumnState",
                parameters: {
                    state: "custom",
                    value: "0 2fr 1fr"
                }
            }

            //Act
            await instance.connectedCallback();

            await instance.onMessage(args);

            const styles = instance.style;

            //Assert
            assertEquals(styles.gridTemplateColumns, expectedValue);
        });

        it("should show the first column of the 3 column grid where the first column in the grid is hidden", async () => {
            const expectedValue = "1fr 1fr 1fr";
            instance.dataset.columns = "1fr 1fr 1fr";
            instance.dataset.rows = "1fr"

            const args = {
                message: "setColumnState",
                parameters: {
                    state: "default"
                }
            }

            //Act
            await instance.connectedCallback();
            await instance.onMessage(args);
            const styles = instance.style;

            //Assert
            assertEquals(styles.gridTemplateColumns, expectedValue);
        });

        it("should not fail if invalid values are passed or if values are null", async () => {
            const expectedValue = "1fr 1fr 1fr";
            instance.dataset.columns = "1fr 1fr 1fr";
            instance.dataset.rows = "1fr"
            const args = {
                message: "setColumnState",
                parameters: {
                    state: "custom",
                    value: null
                }
            }

            //Act
            await instance.connectedCallback();
            await instance.onMessage(args);
            const styles = instance.style;

            //Assert
            assertEquals(styles.gridTemplateColumns, expectedValue);
        });

        it("should not fail if invalid/null values are passed or if state is null", async () => {
            const expectedValue = "1fr 1fr 1fr";
            instance.dataset.columns = "1fr 1fr 1fr";
            instance.dataset.rows = "1fr"
            const args = {
                message: "setColumnState",
                parameters: {
                    state: null,
                    value: null
                }
            }

            //Act
            await instance.connectedCallback();
            await instance.onMessage(args);
            const styles = instance.style;

            //Assert
            assertEquals(styles.gridTemplateColumns, expectedValue);
        });
    });
});