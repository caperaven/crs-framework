import {DataType} from  "./../../components/matrix-renderer/matrix-renderer.js";

export default class MatrixRendererViewModel extends crsbinding.classes.ViewBase {
    #manager = "matrix-data";

    async connectedCallback() {
        await super.connectedCallback();
    }

    async disconnectedCallback() {
        await crs.call("data_manager", "unregister", {
            manager: this.#manager
        })

        await super.disconnectedCallback();
    }

    async load() {
        requestAnimationFrame(async () => {
            const matrix = this.element.querySelector("matrix-renderer");
            const columns = getColumns();

            await crs.call("data_manager", "register", {
                manager: this.#manager,
                id_field: "id",
                type: "memory",
                records: getRows()
            })

            await matrix.initialize({
                frozenColumns: {
                    count: 1
                },
                heights: {
                    groupHeader: 50,
                    header: 40,
                    row: 30
                },
                groups: [
                    { from: 0, to: 3, title: "Group1" },
                    { from: 3, title: "Group2" },
                ],
                columns,
                manager: this.#manager,
                canvas: {
                    height: matrix.offsetHeight,
                    width: matrix.offsetWidth
                }
            });

            super.load();
        });
    }
}

function getColumns() {
    const columns = [
        { title: "Status", field: "status", width: 200 }
    ]

    for (let i = 0; i < 1000; i++) {
        columns.push({ title: `Column ${i}`, field: `column${i}`, type: DataType.BOOLEAN });
    }

    return columns;
}

function getRows() {
    const rows = [];

    for (let i = 0; i < 1000; i++) {
        const row = { id: i, status: `Status ${i}` };

        for (let j = 0; j < 1000; j++) {
            // add random boolean value
            row[`column${j}`] = Math.random() > 0.5;
        }

        rows.push(row);
    }

    return rows;
}

