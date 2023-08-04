import "./../../components/tab-sheet/tab-sheet.js";
export default class TabSheetViewModel extends crs.classes.BindableElement {
    get html() { return import.meta.url.replace(".js", ".html"); }
    get shadowDom() { return true; }
}