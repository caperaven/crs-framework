export const selectedConverter = {
    get (value, args) {
        return value == "true" || value == true ? "check" : "uncheck";
    },

    set (value, args) {
        return value == "check" ? true : false;
    }
}