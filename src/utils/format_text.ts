/**
 * @param map_item: Maps through an array and returns a the output value of the callback in a new array.
 */
import { map_item } from "./array_methods";

/** 
 * Removes underscores and converts the first character of it to uppercase
 * @param {string} text: The string to format.
 * @returns {string}
 */
const format_string = (text: any): string => map_item(text.split("_"), (e: string) => e[0].toUpperCase() + e.slice(1)).join(' ')

export { format_string };