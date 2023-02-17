export class CalendarUtils {

    static calculateCurrentIndex(currentIndex,columnCount) {
        if((currentIndex - columnCount) < 0) {

           return (-(columnCount - currentIndex));
        }
        else {
           return columnCount - currentIndex;
        }
    }
}
