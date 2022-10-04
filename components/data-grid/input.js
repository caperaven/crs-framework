import {markSelected} from "./selection.js";

export async function enableInput(grid) {
    grid._clickHandler = click.bind(grid);
    grid.addEventListener("click", grid._clickHandler);
}

export async function disableInput(grid) {
    grid.removeEventListener("click", grid._clickHandler);
    grid._clickHandler = null;
}

async function click(event) {
    event.preventDefault();

    if (event.target.dataset.field == "_selected") {
        return await markSelected(this, event.target);
    }
}