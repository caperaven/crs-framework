/**
 * @function formattingFromChildren - Sets the formatting of a data table from the children of the table.
 * @param table
 * @returns {Promise<void>}
 *
 * @example <caption>html example</caption>
 * <data-table data-manager="my_data" data-resizeable="true" data-filterable="true" data-moveable="true" data-groupable="true">
 *     <formatter data-condition="price < 20" data-classes="class1 class2" data-styles="background: red; color: blue;"></formatter>
 *     <formatter data-condition="price <= 5" data-classes="class1 class2" data-styles="background: red; color: blue;"></formatter>
 *
 *     <column data-heading="code" data-property="code" data-width="100">
 *         <formatter data-classes="class1, class2" data-styles="background: red; color: blue;"></formatter>
 *         <formatter data-condition="code === 'A'" data-classes="class1 class2" data-styles="background: red; color: blue;"></formatter>
 *     </column>
 *
 *     <column data-heading="description" data-property="description" data-width="200"></column>
 *     <column data-heading="price" data-property="price" data-width="100"></column>
 *     <column data-heading="quantity" data-property="quantity" data-width="100"></column>
 *     <column data-heading="is valid" data-property="isValid" data-width="100"></column>
 * </data-table>
 */
export async function formattingFromChildren(table) {
    const formatterElements = table.querySelectorAll("formatter");
    if (formatterElements.length === 0) return;

    const formatSettings = {
        rows: [],
        columns: {}
    };

    for (let formatterElement of formatterElements) {
        const condition = formatterElement.dataset.condition;
        const classes = formatterElement.dataset.classes.split(" ");
        const styles = formatterElement.dataset.styles;

        const formatter = {
            condition, classes, styles
        }

        if (formatterElement.parentElement.dataset.property == null) {
            formatSettings.rows.push(formatter);
            continue;
        }

        const property = formatterElement.parentElement.dataset.property;
        const propertyCollection = formatSettings.columns[property] ||= [];
        propertyCollection.push(formatter);
    }

    await crs.call("data_table", "set_formatter", {
        element: table,
        settings: formatSettings
    });
}