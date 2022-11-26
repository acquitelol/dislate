/**
 * @param {function} callback: The function to be called
 * @param {any[]} args: The arguments of the function
 * @param {string} name: The name of the plugin in @arg manifest.json. In this case its Dislate.
 * @param {string} function_label: The label for the actual function itself.
 * @param {string?} call_label?: The label for the usage of the function. May be undefined.
 * @returns {~ callback(...args) | undefined}
 */
const try_callback = (callback: any, args: any, name: string, function_label: string, call_label?: string): any => {
    try {
        /** 
         * Execute the callback with @arg args spread as arguments for it.
         * @param callback: The function to call
         * @param args: The arguments for the function
         * 
         * @returns {callback(...args)}
         */
        return callback(...args)
    } catch (err) {
        /** 
         * Return undefined and warn in console that an error happened
         * @param {string} name: The name provided from manifest.json
         * @param {string} label: THe label provided from when the function was called 
         * 
         * @returns {undefined}
         */
        console.warn(`[${name}] The following error happened when trying to ${function_label} ${call_label??"unspecificied label"}: ${err}`)
        return undefined;
    }
}

export { try_callback }