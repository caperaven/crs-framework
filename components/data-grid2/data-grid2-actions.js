import "./data-grid2.js";
import {Columns} from "./columns/columns.js";
import {ConversionType} from "./columns/enums/conversion-type.js";

class DataGrid2Actions {
    static async perform(step, context, process, item) {
        let action = DataGrid2Actions[step.action];
        if (action) {
            return action(step, context, process, item);
        }
    }

    static async initialize(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        element.columns = Columns.from(ConversionType.HTML, element);
        console.log("done")
    }
}

crs.intent.datagrid2 = DataGrid2Actions;