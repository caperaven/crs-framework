export function createRowInflation(grid) {
    const code = [];

    for (let i = 0; i < grid.columns.length; i++) {
        const column = grid.columns[i];

        if (column.convert != null) {
            code.push(`element.children[${i}].textContent = crsbinding.valueConvertersManager.convert(model.${column.field}, "${column.convert.converter}", "get")`);
        }
        else {
            code.push(`element.children[${i}].textContent = model.${column.field}`);
        }
    }

    const fn = new Function("element", "model", code.join("\n"));
    grid.rowInflateFn = fn;
}

export async function createRowElement(grid, inflateFn, model, top, height) {
    const rowElement = await crs.call("dom", "create_element", {
        parent: grid.rowContainer,
        attributes: {
            role: "row"
        },
        styles: {
            height: height,
            translate: `0 ${top}`
        }
    })

    for (const column of grid.columns) {
        const cell = await crs.call("dom", "create_element", {
            parent: rowElement,
            attributes: {
                role: "gridcell"
            }
        })

        if (column.align != null) {
            cell.classList.add(column.align);
        }
    }

    inflateFn(rowElement, model);
}