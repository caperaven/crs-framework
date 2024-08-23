export function createMarker(parentElement, gridData) {
    const oldMarker = parentElement.querySelector(".marker");
    oldMarker?.remove();

    const markerPos = gridData.getScrollMarkerVector();

    const marker = document.createElement("div");
    marker.classList.add("marker");
    marker.style.translate = `${markerPos.x}px ${markerPos.y}px`;
    parentElement.appendChild(marker);
}