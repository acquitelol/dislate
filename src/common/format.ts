/** 
 * Imports 
 * @param ArrayOps.forItem: Loops through an array and runs a callback for each iteration.
 * @param {string} name: The name from manifest.json.
 * @param tryCallback: Function to wrap another function in a try-catch
 */
import ArrayOps from "./array_methods";
import { name } from '../../manifest.json';
import tryCallback from "./try_callback";

/** 
 * Removes underscores and converts the first character of it to uppercase
 * @param {string} text: The string to format.
 * @returns {string}
 */
const string = (text: any, regex?: boolean): string => {
    return ArrayOps.mapItem(text.split(regex ? /(?=[A-Z])/ : "_"), (e: string) => e[0].toUpperCase() + e.slice(1)).join(' ')
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

export default {
   string,
   object
};