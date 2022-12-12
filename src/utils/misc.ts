/** 
 * Imports 
 * @param {string} name: The name from manifest.json.
 * @param try_callback: Function to wrap another function in a try-catch
 * @param {function} Toasts: The function to open a toast on the screen
 * @param {object} Icons: The icons exported in ./Icons
 */
import { name } from '../../manifest.json'
import { try_callback } from "./try_callback";
import { Toasts } from "enmity/metro/common";
import { Icons } from "./icons";

/** 
 * Fetch a list of all external plugins that Dislate might need to account for, including itself.
 * @param {object} external_plugins: An object of plugins with the name as the key and the "key" of their respective element as the value
 */
const external_plugins: { [key: string]: string | undefined; }  = {
    message_spoofer: "69",
    copy_embed: "1337",
    invis_chat: "420",
    cut_message: "512",
    dislate: "1002"
}

/**
 * @param shadow: Native shadow implementation that is used throughout the entire plugin.
 */
type Shadow = { [key: string]: string | number | Shadow }
const shadow: Shadow = {
    shadowColor: "#000",
    shadowOffset: {
        width: 1,
        height: 4,
    },
    shadowOpacity: 0.10,
    shadowRadius: 4.65,
    elevation: 8,
}

 
 /** 
  * Open a toast with the text provided saying it has been copied to clipboard or as a tooltip
  * @param {string} source: The text provided to send inside of the toast
  * @param {'clipboard | 'tooltip'} type: The type of toast to show.
  *
  * @uses @param {string_id} Icons.Clipboard
  * @uses @param {string_id} Icons.Settings.Initial
  * @returns {void}
  */
const toast = (source: string, type: 'clipboard' | 'tooltip') => Toasts.open({ 
    content: type=='clipboard' ? `Copied ${source} to clipboard.` : source, 
    source: type=='clipboard' ? Icons.Clipboard : Icons.Settings.Initial 
});

/** 
 * Chooses whether the color should be Dark or Light depending on the background color of the element.
 * @param {string} color: The background color
 * @param {string} light: The light color
 * @param {string} dark: The dark color
 * @param {number?} boundary: The maximum boundary that the color can reach before choosing dark mode.
 * @param {string?} label: The label of the function when called. May be undefined.
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
         * @param {string} color: The color provided as a @func string, in @func base_any
         * @param {number[]} digits: The digits of the color which it should return as @func base10
         * @param {number} base: The base provided, can be anything but it would be @func base16 when called
         * @returns {~ string formatted_color}
         */
        const parse_color_as_int = (color: string, digits: number[], base: number) => parseInt(color.substring(digits[0], digits[1]), base)

        /**
         * Gets the correct integer color for each part of the color provided
         * @param {number} red: The red value of the color, at @arg {0, 2}
         * @param {number} green: The green value of the color, at @arg {2, 4}
         * @param {number} blue: The blue value of the color, at @arg {4, 6}
         */
        const red = parse_color_as_int(base_color, [0, 2], 16),
              green = parse_color_as_int(base_color, [2, 4], 16),
              blue = parse_color_as_int(base_color, [4, 6], 16);

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

export { external_plugins, shadow, toast, filter_color }