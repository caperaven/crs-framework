import "../../src/actions/columns-actions.js";
import {data} from "./../../data/static.js";
import {createRowInflation, createRowElement} from "./../../components/data-grid/rows.js";
import "../../src/managers/data-manager/data-manager-memory-provider.js"

export default class Grid extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        crsbinding.valueConvertersManager.add("udf", udfConverter);
        crsbinding.valueConvertersManager.add("svg", svgConverter);
    }

    async disconnectedCallback() {
        crsbinding.valueConvertersManager.remove("udf");
        crsbinding.valueConvertersManager.remove("svg");
        await super.disconnectedCallback();
    }

    async preLoad() {
        await crs.call("data_manager",  "register", {
            manager: "store",
            id_field: "workOrderId",
            type: "memory",
            records: data
        })
    }

    async addColumn() {
        await crs.call("grid_columns", "add_columns", {
            element: this.grid,
            columns: [
                { title: "", field: "sequenceNumber:svg()", html: true, width: 42 },
                { title: "Code", field: "workOrderCode", width: 150 },
                { title: "Description", field: "workOrderDescription", width: 200 },
                { title: "Attribute Code", field: "attributeCode", width: 150 },
                { title: "Value", field: "predefinedValueValue:udf()", width: 150 },
            ]
        });

        const rowFormatting = {
            "model.predefinedValueValue?.type.toLowerCase() == 'string'": {
                background: "#ff0090",
                color: "#ffffff"
            },
            "model.predefinedValueValue?.type.toLowerCase() == 'integer'": {
                background: "#0098e0",
                color: "#ffffff"
            }
        };

        const cellFormatting = {
            "sequenceNumber": {
                "model.sequenceNumber == 3": {
                    fill: "#ff0080"
                },

                "model.predefinedValueValue?.type.toLowerCase() == 'string'": {
                    fill: "#ffffff"
                }
            },

            "attributeCode": {
                "model.attributeCode == 'Make'": {
                    background: "#005c87",
                    color: "#ffffff",
                    fontStyle: "italic"
                },
                "model.attributeCode == 'AAIntTest'": {
                    color: "#ccff00"
                }
            }
        }

        createRowInflation(this.grid, "workOrderId", rowFormatting, cellFormatting);

        const records = await crs.call("data_manager", "get_all", { manager: "store"} )
        let top = 0;
        let index = 0;
        for (const record of records) {
            await createRowElement(this.grid, this.grid.rowInflateFn, record, 0,`${top}rem`, "2rem");
            top += 2;
            index += 1;
        }
    }
}

const udfConverter = {
    set (value, args) {
        return value;
    },

    get (value, args) {
        if (value == null) {
            return "";
        }

        return `${value.value} : ${value.type}`;
    }
}

const svgConverter = {
    set (value, args) {
        return value;
    },

    get (value, args) {
        switch(value) {
            case 1: {
                return `
                    <svg class="icon">
                        <use xlink:href="#icon-home"></use>
                    </svg>
                `
                break;
            }
            case 2: {
                return `
                    <svg class="icon">
                        <use xlink:href="#icon-approved"></use>
                    </svg>
                `
                break;
            }
            case 3: {
                return `
                    <svg class="icon">
                        <use xlink:href="#icon-account"></use>
                    </svg>
                `
                break;
            }
            default: {
                return "";
                break;
            }
        }
    }
}