export class CalendarHelperMethods {

    /**
     * It returns an array of years, starting from the current year minus the minYearSelectOffset and ending at the current
     * year plus the maxYearSelectOffset
     * @param maxYearSelectOffset {number} - The maximum number of years in the future that the user can select.
     * @param minYearSelectOffset {number} - The minimum year that can be selected in the dropdown.
     * @returns An array of years.
     */
    static async populateYears(maxYearSelectOffset, minYearSelectOffset) {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear - minYearSelectOffset; i <= currentYear + maxYearSelectOffset; i++) {
            years.push(i);
        }
        return years;
    }

}
