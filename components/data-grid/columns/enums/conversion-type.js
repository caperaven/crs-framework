/**
 * @description how to convert columns to and from.
 * In other words
 * - from HTML
 * - from JSON
 * - to CSS
 * - to HTML
 * There is a difference in the from HTML and to HTML.
 * From HTML will read the HTML as markup but that is not the header HTML.
 * The to HTML will return the header HTML used by the grid for rendering.
 * @type {Readonly<{CSS: string, JSON: string, HTML: string}>}
 */
export const ConversionType = Object.freeze({
    CSS: "css",
    JSON: "json",
    HTML: "html"
});