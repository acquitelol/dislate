/** 
 * Imports 
 * @param ArrayOps.forItem: Loops through an array and runs a callback for each iteration.
 * @param {string} name: The name from manifest.json.
 * @param tryCallback: Function to wrap another function in a try-catch
 */
import ArrayOps from "./array_methods";
import { name } from '../../manifest.json'
import tryCallback from "./try_callback";

/** 
 * Removes underscores and converts the first character of it to uppercase
 * @param {string} text: The string to format.
 * @returns {string}
 */
const string = (text: any): string => {
    return ArrayOps.mapItem(text.split("_"), (e: string) => e[0].toUpperCase() + e.slice(1)).join(' ')
}

/** 
 * Convert a badly formatted string into a JSON-parsable format.
 * @param text: The source text
 * @param {string?} label: The label of the function when called. May be undefined.
 * @returns {string} Formatted Text
 */
const object = (text: string, label?: string): string => {
    return tryCallback(() => {
        /** 
         * Convert the string into a key value pair. For example {iPhone12,8 : iPhone SE 2nd Gen} -> {"iPhone12,8":" iPhone SE 2nd Gen"}
         * @param {any} formattedText: The text which will be eventually formatted into an object
         */
        let formattedText: any = ArrayOps.mapItem(text.split('\n'), (line: any, index: number) => {
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
        formattedText[0]=`{${formattedText[0]}`
        formattedText[formattedText.length - 1] = `${formattedText[formattedText.length -1]}}`

        /** 
         * Remove the first comma, starting at the end, and then return the formatted string
         * @param {any} formattedText: The formatted text
         * 
         * @returns {string}
         */
        return formattedText.join('');
    }, [text], name, 'formatting object at', label)
}

/**
 * Reverses each key and value pair of an object
 * @param {object} object: The object's keys and values to reverse.
 * @param {string?} label: The label of the function when called. May be undefined.
 * @returns {object}
 */
const reverse = (object: any, label?: any): any => {
    return tryCallback(() => {
        /**
         * Maps over the object's keys and returns the value as the key and the key as the value for each iteration in the Array
         * @param {object} newObject: The new object which will be populated with the keys as the values and the values as the keys
         */
        const newObject: any = {}

        /**
         * Loops through the keys of the object. The values of the object arent required, as they're already accessible by using @arg {object[key]}
         * This uses a custom for loop implementation. It is identical in functionality to @arg Array.prototype.forEach, but i can assign labels to it.
         */
        ArrayOps.forItem(Object.keys(object), (key: string) => {
            Object.assign(newObject, { [object[key]] : key })
        }, 'reversing object')

        /**
         * Finally, return the new object.
         * @returns {~ new object}
         */
        return newObject
    }, [object], name, 'reversing object at', label)
}

export default 
{
   string,
   object,
   reverse 
}