export class BooleanImages {
    static async from(folder) {
        return {
            true  : await loadImage(new URL("true.png", folder)),
            false : await loadImage(new URL("false.png", folder)),
            null  : await loadImage(new URL("null.png", folder)),
        };
    }
}

async function loadImage(path) {
    const image = new Image();
    image.src = path;

    await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
    });

    return image;
}