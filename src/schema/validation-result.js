const SUCCESS = "success";
const ERROR = "error";
const WARNING = "warning";

/**
 * @class ValidationResult
 * @description This class is responsible for returning the result of the validation.
 */
export class ValidationResult {
    static isError(validation) {
        return validation.type === ERROR;
    }

    static isSuccess(validation) {
        return validation.type === SUCCESS;
    }

    static isWarning(validation) {
        return validation.type === WARNING;
    }

    /**
     * @method error
     * @description This method is responsible for returning an error message.
     * @param message {String} The message to return.
     * @param path {String} The path of the schema part.
     * @returns {{type: string, message}}
     */
    static error(message, path = "") {
        return Object.freeze({ type: ERROR, message, path });
    }

    /**
     * @method warning
     * @description This method is responsible for returning a warning message.
     * @param message {String} The message to return.
     * @param path {String} The path of the schema part
     * @returns {Readonly<{path: string, type: string, message}>}
     */
    static warning(message, path = "") {
        return Object.freeze({ type: WARNING, message, path });
    }

    /**
     * @method success
     * @description This method is responsible for returning a success message.
     * @param message {String} The message to return.
     * @param path {String} The path of the schema part.
     * @returns {{type: string}}
     */
    static success(message, path = "") {
        return Object.freeze({ type: SUCCESS, message, path });
    }
}