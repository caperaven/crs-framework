import "./../../components/filter-header/filter-header.js"

export default class Icons extends crsbinding.classes.ViewBase {
    async preLoad(setProperty) {
        const definition = await fetch("/resources/fonts/icons/crs-framework.json").then((response)=> response.json());
        const icons = definition.iconSets[0].icons.map(_=>  _.tags[0]).sort();
        setProperty("icons", icons)
    }
}

