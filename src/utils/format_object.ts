/** Convert a badly formatted string into a JSON-parsable format.
 * @param text: The source text
 * @returns {string} formatted_text
 */
const format_object = (text: string): string => {
    /** Convert the string into a key value pair. For example {iPhone12,8 : iPhone SE 2nd Gen} -> {"iPhone12,8":" iPhone SE 2nd Gen"}
     * @param {any} formatted_text: The text which will be eventually formatted into an object
     */
    let formatted_text: any = text.split('\n').map((line: any, index: number) => {
        if (line=='') return;
        /**
         * Add quotation marks to the string and remove spaces
         */
        return `"${line.replaceAll(':', `":"`).replace(' ', '')}"${index==(text.split('\n').length-1)?"":","}`
    })

    /**
     * Add a curly bracket to first index of the array (@arg {the beginning of the array})
     * Add a curly bracket to last index of the array (@arg {the end of the array})
     */
    formatted_text[0]=`{${formatted_text[0]}`
    formatted_text[formatted_text.length - 1] = `${formatted_text[formatted_text.length -1]}}`

    /** Remove the first comma, starting at the end, and then return the formatted string
     * @param {any} formatted_text: The formatted text
     * 
     * @returns {string}
     */
    console.log(formatted_text.join(''))
    return formatted_text.join('');
}

export {format_object}