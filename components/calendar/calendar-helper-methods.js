export class CalendarHelperMethods {
    /**
     * returns an array of years to populate the years options
     * @param year
     * @returns {Promise<*[]>}
     */
    static  async populateYears(year) {
        let years = [];
        const startingYear =  (year - 100);
        const endingYear = (year + 100);
        for( let i = startingYear; i <= endingYear ; i++) {
            years.push(i);
        }

        return years;
    }
}


