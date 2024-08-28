import "./data-grid.js";
import {Columns} from "./columns/columns.js";
import {ConversionType} from "./columns/enums/conversion-type.js";

const COLUMNS_ELEMENT_QUERY = "columns";

class DataGridActions {
    static async perform(step, context, process, item) {
        let action = DataGridActions[step.action];
        if (action) {
            return action(step, context, process, item);
        }
    }

    static async initialize(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const dataManager = await crs.process.getValue(step.args.manager, context, process, item);
        element.columns = Columns.from(ConversionType.HTML, element);
        element.dataManager = dataManager;

        const columnsElement = element.querySelector(COLUMNS_ELEMENT_QUERY);
        columnsElement.remove();
        console.log("DataGridActions.initialize.done");
    }
}

crs.intent.datagrid2 = DataGridActions;