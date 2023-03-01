/**
 * To run this call
 * deno run --allow-all build/new_component.js my-element
 * @type {string}
 */

const element = Deno.args[0];
const className = getClassName(element);

createFile("./build/templates/component/component.js", `./components/${element}/${element}.js`);
createFile("./build/templates/component/component.html", `./components/${element}/${element}.html`);
createFile("./build/templates/component/component.test.js", `./test/components/${element}/${element}.test.js`);
createFile("./build/templates/component/view.js", `./app/${element}/${element}.js`);
createFile("./build/templates/component/view.html", `./app/${element}/${element}.html`);

addRoute(element);

/**
 * Read the "./app/routes.json" file and add the new route.
 * The file is json so convert it to json, add the new route, then convert it back to a string.
 * @param element
 */
function addRoute(element) {
    const json = JSON.parse(Deno.readTextFileSync("./app/routes.json"));
    json["routes"].push({
        title: element,
        hash: `#${element}`,
        view: element
    });
    Deno.writeTextFileSync("./app/routes.json", JSON.stringify(json, null, 4));
}

function getClassName(element) {
    const parts = element.split("-");
    let className = "";
    for (let part of parts) {
        className += part.charAt(0).toUpperCase() + part.slice(1);
    }
    return className;
}

function createFile(source, target) {
    ensurePath(source);
    ensurePath(target);

    const content = Deno.readTextFileSync(source);
    const newContent = content.replaceAll("__element__", element).replaceAll("__class__", className);
    Deno.writeTextFileSync(target, newContent);
}

function ensurePath(path) {
    const directoryPath = path.substring(0, path.lastIndexOf("/"));

    try {
        Deno.mkdirSync(directoryPath, { recursive: true });
    } catch (error) {
        // Handle error if directory creation fails
    }
}