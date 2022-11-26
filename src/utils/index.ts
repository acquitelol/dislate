/**
 * @param translate_string: Allows you to translate a string into another language with specific parameters passed
 */
import { translate_string } from "./translate";

/**
 * @param format_string: Adds a capital letter to the beginning and replaces underscores with spaces in a @arg string.
 */
import { format_string } from './format_text'

/**
 * Main Debug Info Functions
 * @param debug_info: Formats the possible arguments into a format that can be sent as a Discord Message.
 * @param fetch_debug_arguments: Asynchronously fetches the full list of debug arguments. This is its own function for ease of use.
 * @param send_debug_log: Sends a debug log into the current channel with a list of options.
 */
import { 
    debug_info, 
    fetch_debug_arguments, 
    send_debug_log, 
} from './debug'

/**
 * @param clipboard_toast: Opens a @arg Toast which informs the user that @arg {any} something has been copied to clipboard
 */
import { clipboard_toast } from "./clipboard";

/**
 * Main Miscallaneous Modules
 * @param external_plugins: List of external plugin keys to be verified in @arg index.tsx and push down the Dislate button if any are found.
 * @param filter_color: Takes an input color and returns a dark or light color if the contrast of the given color reaches a threshold.
 */
import { external_plugins, filter_color } from './misc'

/**
 * Main Custom Array Manipulation Implementations. These are all available in 
 * @param insert_item: Adds an item into an array at a given index.
 * @param find_item: Searches for an item in an array based on a callback, and returns the item if found and undefined if not found.
 * @param for_item: Loops through an array and executes a callback for each iteration. This returns void.
 * @param map_item: Loops through an array and executes a callback for each iteration, then concatenates the result of that callback to a new array. This returns a mapped array.
 * @param filter_item: Loops through an array and only adds the items on which the callback returns true. Returns a filtered array.
 */
import { 
    insert_item, 
    find_item,
    for_item,
    map_item,
    filter_item
} from './array_methods' 

/**
 * Main Modules involving native device names
 * @param get_device_list: Fetches the full list of devices, formatted as an object. This is used for both @arg debug_log and @arg check_if_compatible_device
 * @param check_if_compatible_device: Checks if the current device is compatible (not a home button iPhone). If it is incompatible, open a dialog informing the user.
 */
import { get_device_list, check_if_compatible_device } from "./devices";

/**
 * @param try_callback: Allows a function to be nested as a callback with a function label and optional call label.
 */
import { try_callback } from "./try_callback";

/**
 * @param store_item: Either sets a Setting or stores an item in Storage depending on the object passed, and also adds it to a list of state to be cleared from @arg {</dislate:1> type:Clear Stores} and from the @arg settings panel
 */
import { store_item } from "./store_item";

/**
 * @param Icons: List of icons used throughout Dislate, all in a single Object to allow for changing easily.
 */
import { Icons } from "./icons";

/**
 * Main Modules to manipulate Objects.
 * @param format_object: Formats the specific return from the Device List GitHub Gist as a valid JSON object.
 * @param reverse_object: Returns a given object with the keys as the values and the values as the keys.
 */
import { format_object, reverse_object } from "./object";

export { 
    translate_string, 
    format_string, 
    debug_info, 
    fetch_debug_arguments,
    send_debug_log,
    clipboard_toast, 
    external_plugins, 
    find_item, 
    insert_item,
    for_item,
    map_item,
    filter_item,
    get_device_list,
    check_if_compatible_device,
    try_callback,
    Icons,
    filter_color,
    store_item,
    format_object,
    reverse_object
};