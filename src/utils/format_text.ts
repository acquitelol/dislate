/** Removes underscores and converts the first character of it to uppercase
 * @param {string} text: The string to format.
 * @returns {string}
 */
const format_string = (text: any): string => text.split("_").map((e: string) => e[0].toUpperCase() + e.slice(1)).join(' ')

export { format_string };