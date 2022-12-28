/**
 * @param {function} callback: The function to be called
 * @param {any[]} args: The arguments of the function
 * @param {string} name: The name of the plugin in @arg manifest.json. In this case its Dislate.
 * @param {string} functionLabel: The label for the actual function itself.
 * @param {string?} callLabel?: The label for the usage of the function. May be undefined.
 * @returns {~ callback(...args) | undefined}
 */
export default (callback: any, args: any, name: string, functionLabel: string, callLabel?: string): any => {
    try {
        /** 
         * Execute the callback with @arg args spread as arguments for it.
         * @uses @param callback: The function to call
         * @uses @param {any} args: The arguments for the function
         * 
         * @returns {callback(...args)}
         */
        return callback(...args)
    } catch (err) {
        /** 
         * Return undefined and warn in console that an error happened
         * @uses @param {string} name: The name provided from manifest.json
         * @uses @param {string} label: THe label provided from when the function was called 
         * 
         * @returns {undefined}
         */
        console.warn(`[${name}] The following error happened when trying to ${functionLabel} ${callLabel ?? "unspecificied label"}: ${err}`)
        return undefined;
    }
}