export async function validateCell(cellElement) {
    const fieldName = cellElement.dataset.field;
    const definitionElement = cellElement.closest("[data-def]");
    const definition = definitionElement.dataset.def;
    const fieldDefinition = await crs.call("cell_editing", "get_field_definition", {
        name: definition,
        field_name: fieldName
    })

    const result = await performDefaultValidations(fieldDefinition, cellElement);

    if (result !== true) {
        cellElement.setAttribute("aria-errormessage", result);
        return false;
    }

    cellElement.removeAttribute("aria-errormessage");
    return true;
}

/**
 * If there are no errors defined for a failing validation then use the default error message.
 * @type {{required: string}}
 */
const defaultErrors = {
    required: "validation.required"
}

class Validate {
    static required(value, validationDef) {
        if (validationDef.required == true && value?.length == 0) {
            return validationDef.message || crs.binding.translations.get(defaultErrors["required"]);
        }

        return true;
    }
}

function performDefaultValidations(fieldDefinition, element) {
    if (fieldDefinition.defaultValidations == null) return true;

    const value = element.textContent;

    for (const validationName in fieldDefinition.defaultValidations) {
        const validationDef = fieldDefinition.defaultValidations[validationName];
        const result = Validate[validationName](value, validationDef);

        if (result !== true) {
            return result;
        }
    }

    return true;
}