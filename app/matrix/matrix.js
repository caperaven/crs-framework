import "./matrix-canvas/matrix-canvas.js";

export default class MatrixViewModel extends crs.classes.BindableElement {

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    get hasStyle() {
        return true;
    }

    async load() {
        const matrixCanvas = this.shadowRoot.querySelector("matrix-canvas");

        const columns = [];
        for (let i = 0; i < 1000; i++) {
            columns.push({field: `Field${i}`, title: `Field ${i}`});
        }

        const rows = [];
        for (let i = 0; i < 1000; i++) {
            const row = {id: i};
            for (let j = 0; j < 1000; j++) {
                row[`Field${j}`] = `Row ${i} Field ${j}`;
            }
            rows.push(row);
        }

        await crs.call("component", "on_ready", {
            element: matrixCanvas,
            caller: this,
            callback: async () => {
                const data = {
                    rows,
                    columns,
                    columnWidth: 100,
                    rowHeight: 32,
                    columnGroups: {
                        "Group 1": {start: 2, end: 10},
                        "Group 2": {start: 11, end: 100},
                        "Group 3": {start: 101}
                    }
                }

                await matrixCanvas.setData(data);
            }
        });
    }
}