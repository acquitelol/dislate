/** Imports 
 * @param {string{}} Manifest: The strings required from manifest.json
 * @param {unknown} Native: The Native component
 * @param {function} get_device_list: The async function to get the device list from an API or from Storage.
 * @param {function} for_item: Loops through an array.
 * @param {function} push_item: Pushes to an array.
 * @param try_callback: Function to wrap another function in a try-catch
 */
import { name, release, version, plugin } from '../../manifest.json'
import { Messages, Native, Navigation, Toasts } from 'enmity/metro/common'
import { get_device_list } from './devices'
import { for_item, insert_item } from './array_methods'
import { try_callback } from './try_callback'
import { Icons } from './icons'

/** Fetches the debug arguments. This is used in a lot of functions, and adding anything here will change it everywhere.
 * @returns {Promise<{ [key: string]: string | undefined; }>}
 */
async function fetch_debug_arguments(): Promise<{ [key: string]: string | undefined; }> {
    /** Gets the list of devices asynchronously from the function
     * @param {object} devices: The formatted list of devices from the API.
     */
    const devices = await get_device_list()
    return {
        "Plugin Version": version,
        "Plugin Build": (plugin.build).split('-')[1],
        "Release Channel": release,
        "Discord Build": Native.InfoDictionaryManager.Version,
        "Software Version": Native.DCDDeviceManager.systemVersion,
        "Device": devices[Native.DCDDeviceManager.device]
    }
}

/** Returns an interpolated string lasting multiple lines of the debug information depending on how many options were chosen in the Debug command. All unconventional methods such as copying in Settings will choose all of the options.
 * @param {string[]} options: The array of options, as strings.
 * @returns {Promise<string>};
 */
async function debug_info(options: string[], label?: string): Promise<string> {
    return await try_callback(async function() {
        /** Creates an "empty" array with only the default header
         * @param {string[]} final_debug: The final array of items which will be joined into a string.
         * @param { { [key: string]: any; } } debug_list: The full list of debug arguments
         */
        let final_debug: string[] = [`**[${name}] Debug Information**`]
        const debug_list: { [key: string]: any; } = await fetch_debug_arguments()
        for_item(options, (option: string) => {
            /** Only pushes to the new array for each option that exists in the debug list
             * @param {string} option: The string option that will be checked to see if exists in the array.
             */
            debug_list[option] 
                ?   insert_item(final_debug, `> **${option}**: ${debug_list[option]}`, final_debug.length, 'pushing to debug argument array')
                :   null
        }, 'looping through debug options')

        /** Return the final array of items, joined together by \n.
         * @param {string} final_debug: The final debug information
         */
        return final_debug.join('\n')
    }, [options], name, 'creating debug info at', label)
}

/**
 * Sends a debug log with the specific parameters into a channel.
 * @param options: The list of debug options to be sent by the command.
 * @param {~ channel_id, channel_name}: The channel name and id, used for sending the message in a specific channel and displaying the correct channel name in the toast.
 * @param type: The type of log that has been called. An example would be @arg partial or @arg full.
 * @param label: The label which describes what this function was doing. May be optional
 * @returns {~ Promise<void>}
 */
async function send_debug_log(options: string[], {channel_id, channel_name}, type: string, label?: string): Promise<void> {
    await try_callback(async function() {
        /**
         * This closes the most top-level item in the Navigation stack. As the current @arg Info page is at the top, because this button is visible, This method will close the page.
         * @param Navigation.pop: Removes the top item from an array or stack.
         */
        Navigation.pop()

        /**
         * Pass the list of options as a parameter to the @func debug_info function, and then send it to the channel where the command was triggered.
         * @param options: The list of options to render out on the page, from the parameters passed.
         */
        Messages.sendMessage(channel_id, {
            content: await debug_info(options)
        });

        /**
         * Opens a toast saying that a Log with the specific type has been sent to the channel_name.
         * @param type: The type of log that has been sent
         * @param channel_name: The name of the channel where the message has been sent.
         */
        Toasts.open({ 
            content: `Sent ${type} log in #${channel_name}.`, 
            source: Icons.Settings.Toasts.Settings
        })
    }, [options, type], name, 'sending debug log at', label)
}

/** Chooses whether the color should be Dark or Light depending on the background color of the element.
 * @param color: The background color
 * @param light: The light color
 * @param dark: The dark color
 * @param boundary: The maximum boundary that the color can reach before choosing dark mode.
 * @returns {string color}
 */
const filter_color = (color: string, light: string, dark: string, boundary: number = 186, label?: string): string => {
    return try_callback(() => {
        /**
         * Gets the @arg color without the @arg {#} (@arg {#FFFFFF} -> @arg {FFFFFF})
         */
        let base_color = color.replace("#", "")

        /**
         * Parses a color as an integer from any @arg base provided to @arg {base 10}
         * @param color: The color provided as a @func string, in @func base_any
         * @param digits: The digits of the color which it should return as @func base10
         * @param base: The base provided, can be anything but it would be @func base16 when called
         * @returns {~ string formatted_color}
         */
        const parse_color_as_int = (color: string, digits: number[], base: number) => parseInt(color.substring(digits[0], digits[1]), base)

        /**
         * Gets the correct integer color for each part of the color provided
         * @param {number} red: The red value of the color, at @arg {0, 2}
         * @param {number} green: The green value of the color, at @arg {2, 4}
         * @param {number} blue: The blue value of the color, at @arg {4, 6}
         */
        let red = parse_color_as_int(base_color, [0, 2], 16);
        let green = parse_color_as_int(base_color, [2, 4], 16);
        let blue = parse_color_as_int(base_color, [4, 6], 16);

        /**
         * Checks if the colors added up are higher than the boundary, and returns the light or dark color accordingly
         * @returns ->
                 * @if {(@arg red + @arg green + @arg blue are bigger than the boundary)} -> Return the dark color.
                 * @else {()} -> Return the light color. 
         */
        return (((red + green + blue) / (255 * 3)) > boundary)
            ?   dark 
            :   light
    }, [color, light, dark, boundary], name, 'checking if color should be light or dark at', label)
}

export { debug_info, fetch_debug_arguments, send_debug_log, filter_color }
