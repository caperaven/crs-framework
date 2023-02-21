export class CalendarUtils {
    static getYearsAround(year, startOffset, endOffset) {
        return Array.from({ length: endOffset - startOffset + 1 }, (_, i) => year + startOffset + i);
    }
}
