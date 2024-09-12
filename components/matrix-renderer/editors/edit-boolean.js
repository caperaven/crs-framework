export function editBoolean(ctx, def, rowIndex, column, aabb, parent) {
    const boolValue = def.rows[rowIndex][column.field];

    crs.call("data_manager", "update", {
        manager: def.manager,
        index: rowIndex,
        changes: {
            [column.field]: !boolValue
        }
    })
}