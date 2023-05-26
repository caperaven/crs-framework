import {markSelected, markAllSelected} from "./selection.js";

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
    const target = event.composedPath()[0];

    // click on cell for selection
    if (target.dataset.field == "_selected") {
        return await markSelected(this, target);
    }

    // click on selection header
    if (target.classList.contains("selection")) {
        const checked = target.textContent == "check";
        await markAllSelected(this, !checked);
        return target.textContent = checked ? "uncheck" : "check";
    }
}