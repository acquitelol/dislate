/** 
 * Imports 
 * @param for_item: Loops through an array and runs a callback for each iteration.
 * @param {string} name: The name from manifest.json.
 * @param try_callback: Function to wrap another function in a try-catch
 */
import { for_item, map_item } from "./array_methods";
import { name } from '../../manifest.json'
import { try_callback } from "./try_callback";

/** 
 * Removes underscores and converts the first character of it to uppercase
 * @param {string} text: The string to format.
 * @returns {string}
 */
const format_string = (text: any): string => map_item(text.split("_"), (e: string) => e[0].toUpperCase() + e.slice(1)).join(' ')

/** 
 * Convert a badly formatted string into a JSON-parsable format.
 * @param text: The source text
 * @returns {string} formatted_text
 */
const format_object = (text: string, label: string): string => {
    return try_callback(() => {
        /** 
         * Convert the string into a key value pair. For example {iPhone12,8 : iPhone SE 2nd Gen} -> {"iPhone12,8":" iPhone SE 2nd Gen"}
         * @param {any} formatted_text: The text which will be eventually formatted into an object
         */
        let formatted_text: any = map_item(text.split('\n'), (line: any, index: number) => {
            if (line=='') return;
            /**
             * Add quotation marks to the string and remove spaces
             * Also don't add a comma to the end of the string if it is the last index
             */
            return `"${line.replaceAll(':', `":"`).replace(' ', '')}"${index==(text.split('\n').length-1)?"":","}`
        }, 'formatting object')

        /**
         * Add a curly bracket to first index of the array (@arg {the beginning of the array})
         * Add a curly bracket to last index of the array (@arg {the end of the array})
         */
        formatted_text[0]=`{${formatted_text[0]}`
        formatted_text[formatted_text.length - 1] = `${formatted_text[formatted_text.length -1]}}`

        /** 
         * Remove the first comma, starting at the end, and then return the formatted string
         * @param {any} formatted_text: The formatted text
         * 
         * @returns {string}
         */
        return formatted_text.join('');
    }, [text], name, 'formatting object at', label)
}

/**
 * Reverses each key and value pair of an object
 * @param {object} object: The object's keys and values to reverse.
 * @returns {object}
 */
const reverse_object = (object: any, label?: any): any => {
    return try_callback(() => {
        /**
         * Maps over the object's keys and returns the value as the key and the key as the value for each iteration in the Array
         * @param {object} new_object: The new object which will be populated with the keys as the values and the values as the keys
         */
        const new_object: any = {}

        /**
         * Loops through the keys of the object. The values of the object arent required, as they're already accessible by using @arg {object[key]}
         * This uses a custom for loop implementation. It is identical in functionality to @arg Array.prototype.forEach, but i can assign labels to it.
         */
        for_item(Object.keys(object), (key: string) => {
            Object.assign(new_object, {[object[key]]: key})
        }, 'reversing object')

        /**
         * Finally, return the new object.
         * @returns {~ new object}
         */
        return new_object
    }, [object], name, 'reversing object at', label)
}

export { format_string, format_object, reverse_object }