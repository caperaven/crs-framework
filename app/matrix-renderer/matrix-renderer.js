import {DataType} from  "./../../components/matrix-renderer/matrix-renderer.js";

export default class MatrixRendererViewModel extends crsbinding.classes.ViewBase {
    #manager = "matrix-data";
    #matrix;

    async connectedCallback() {
        await super.connectedCallback();
    }

    async disconnectedCallback() {
        await crs.call("data_manager", "unregister", {
            manager: this.#manager
        })

        this.#matrix.removeEventListener("edit-row", this.#editRow);
        this.#matrix = null;

        await super.disconnectedCallback();
    }

    async load() {
        requestAnimationFrame(async () => {
            this.#matrix = this.element.querySelector("matrix-renderer");
            const columns = getColumns();

            this.#matrix.addEventListener("edit-row", this.#editRow);

            await crs.call("data_manager", "register", {
                manager: this.#manager,
                id_field: "id",
                type: "memory",
                records: getRows()
            })

            await this.#matrix.initialize({
                errors: {
                    "1,0": {"message": "Something went wrong"},
                    "2,1": {"message": "This is not correct"},
                    "25,10": {"message": "Error 25, 10"},
                    "100,100": {"message": "Error 100, 100"}
                },

                frozenColumns: {
                    count: 1
                },
                heights: {
                    groupHeader: 32,
                    header: 32,
                    row: 32
                },
                groups: [
                    { from: 0, to: 3, title: "Group1" },
                    { from: 3, title: "Group2" },
                ],
                columns,
                manager: this.#manager,
                canvas: {
                    height: this.#matrix.offsetHeight,
                    width: this.#matrix.offsetWidth
                }
            });

            super.load();
        });
    }

    #editRow(event) {
        console.log(event.detail);
    }
}

function getColumns() {
    const columns = [
        { title: "Status", field: "status", width: 200, editable: false },
        { title: "Values", field: "values", width: 100, editable: true }
    ]

    for (let i = 0; i < 1000; i++) {
        columns.push({ title: `Column ${i}`, field: `column${i}`, type: DataType.BOOLEAN, editable: true });
    }

    return columns;
}

function getRows() {
    const rows = [];

    for (let i = 0; i < 10000; i++) {
        const row = { id: i, status: `Status ${i}`, values: `Value ${i}` };

        for (let j = 0; j < 1000; j++) {
            // add random boolean value
            row[`column${j}`] = Math.random() > 0.5;
        }

        rows.push(row);
    }

    return rows;
}

