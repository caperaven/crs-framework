import "./../../src/actions/cell-editing-actions.js"

export default class CellEditingViewModel extends crs.classes.BindableElement {
    #getAllowedValuesHandler = this.#getAllowedValues.bind(this);

    #model = {
        "value": 10,
        "UDF1": null,
        "UDF2": null,
        "UDF3": null
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async load() {
        await crs.call("cell_editing", "register", {
            name: "cell",
            element: this.shadowRoot.querySelector("#divCell"),
            definition: {
                fields: {
                    value: {
                        dataType: "number",
                        defaultValidations: {
                            "required": {
                                "required": true,
                                "message": "Value is required"
                            }
                        }
                    }
                }
            },
            model: this.#model
        });

        await crs.call("cell_editing", "register", {
            name: "grid",
            element: this.shadowRoot.querySelector(".grid"),
            definition: {
                fields: {
                    UDF1: {
                        dataType: "string",
                        defaultValidations: {
                            required: {
                                required: true,
                                message: "UDF1 is required"
                            }
                        }
                    },
                    UDF2: {
                        dataType: "string",
                        cellType: "select",
                        callback: this.#getAllowedValuesHandler,
                        defaultValidations: {
                            required: {
                                required: true,
                                message: "UDF2 is required"
                            }
                        }
                    },
                    UDF3: {
                        dataType: "string",
                        cellType: "lookup",
                        callback: this.#getAllowedValuesHandler,
                        defaultValidations: {
                            required: {
                                required: true,
                                message: "UDF3 is required"
                            }
                        }
                    }
                }
            },
            model: this.#model
        })
    }

    async disconnectedCallback() {
        await crs.call("cell_editing", "unregister", {
            name: "cell"
        });

        await crs.call("cell_editing", "unregister", {
            name: "grid"
        });

        super.disconnectedCallback();
    }

    async #getAllowedValues(args) {

    }
}