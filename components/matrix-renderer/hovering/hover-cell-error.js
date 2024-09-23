export function checkForErrors(details, rowIndex, columnIndex) {
    if (details.def.errors != null) {
        const error = details.def.errors[`${rowIndex},${columnIndex}`];
        if (error != null) {
            const toolX = details.canvasAABB.left + details.offsetX;
            const toolY = details.canvasAABB.top + details.offsetY;

            crsbinding.events.emitter.emit("tooltip", {
                action: "show",
                tooltip: error.message,
                point: {x: toolX, y: toolY},
                styles: {
                    border: "solid 1px var(--red)",
                    background: "var(--red-s3)",
                    color: "var(--red)"
                },
                duration: 3000
            })

            return true;
        }
    }

    return false;
}