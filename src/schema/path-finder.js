/**
 * Finds an item in the schema by the given path.
 * @param schema {object} - json schema object
 * @param path {string} - path to the
 * @returns {*|null}
 *
 * @example paths supported:
 * - "0" - find the first element in the root
 * - "/0" - find the first element in the root
 * - "/0/" - find the first element in the root
 * - "/0/1" - find the second element in the first element in the root
 * - "#my-div" - find the element with the id "my-div"
 * - "#my-div/0" - find the first element in the element with the id "my-div"
 * - "#my-div/1/actions/element=button" - find the action with the element "button" in the element with the id "my-div" "actions" property
 * - "#my-div/1/actions/element=button&action=click" - find the action with the element "button" and action "click" in the element with the id "my-div"
 */
export function schemaItemAt(schema, path) {
    if (schema.body == null) {
        return null;
    }

    if (path.length === 0 || path === "/") {
        return schema.body;
    }

    // 1. remove "/" from the start and end of the as we don't need them for the split
    path = path.replace(/^\/|\/$/g, '');

    // 2. split the path by "/" for further processing
    const pathParts = path.split("/");

    // 3. start from the root of the schema
    let currentObj = schema.body;

    for (const part of pathParts) {
        // does the part start with a "#"? then it is an id of a child
        if (part.startsWith("#")) {
            currentObj = findChildById(currentObj, part.slice(1)); // strip out the # at the front
        }
        // if the part is a number, then it is an index of a child
        else if (!isNaN(part)) {
            currentObj = findChildByIndex(currentObj, Number(part));
        }
        // else it is a property name
        else {
            currentObj = findChildByProperty(currentObj, part);
        }

        if (currentObj == null) {
            return null;
        }
    }

    return currentObj;
}

/**
 * Finds a child by id in the given object.
 * @param obj {object} - object to search in
 * @param id {string} - id to search for
 * @returns {object}
 */
function findChildById(obj, id) {
    const collection = getCollection(obj);
    return collection.find(element => element.id === id);
}

/**
 * @function findChildByIndex
 * @description Finds a child by index in the given object.
 * @param obj {object} - object to search in
 * @param index {number} - index to search for
 * @returns {*}
 */
function findChildByIndex(obj, index) {
    const collection = getCollection(obj);
    return collection[index];
}

/**
 * @fuction findChildByProperty
 * @description Finds a child by property in the given object.
 * @param obj {object} - object to search in
 * @param property {string} - property to search for
 * @returns {*}
 */
function findChildByProperty(obj, property) {
    if (property.indexOf("=") !== -1) {
        return findChildByPropertyAndValue(obj, property);
    }

    if (Array.isArray(obj)) {
        return obj.find(element => element.hasOwnProperty(property));
    }

    return obj[property];
}

/**
 * @function findChildByPropertyAndValue
 * @description Finds a child by property and value in the given object.
 * @param obj {object} - object to search in
 * @param expr {string} - expression to search for
 * @returns {unknown}
 */
function findChildByPropertyAndValue(obj, expr) {
    const expressions = expr.split("&");

    const searchObjects = expressions.map(expression => {
        const [property, value] = expression.split("=");
        return { property, value };
    });

    const collection = getCollection(obj);

    return collection.find(element => {
        return searchObjects.every(searchObj => {
            return element[searchObj.property] === searchObj.value;
        });
    });
}

/**
 * @function getCollection
 * @description Returns the collection of elements from the given object.
 * @param obj {object} - object to get the collection from
 * @returns {*|[{elements: [{content: string, element: string}], element: string}]|[{content: string, element: string}]|[{elements: [{field: string, title: string, element: string}], element: string}]|[{field: string, title: string, element: string}]|[{elements: [{content: string, element: string},{elements: [{content: string, element: string},{content: string, element: string}], actions: [{action: string, element: string},{action: string, id: string, element: string}], element: string}], id: string, element: string}]|[{content: string, element: string},{elements: [{content: string, element: string},{content: string, element: string}], actions: [{action: string, element: string},{action: string, id: string, element: string}], element: string}]|[{content: string, element: string},{content: string, element: string}]|HTMLCollection|HTMLFormControlsCollection|ActiveX.ISchemaItemCollection}
 */
function getCollection(obj) {
    return Array.isArray(obj) ? obj : obj.elements;
}