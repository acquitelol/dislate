/**
 * @param Translate.string: Allows you to translate a string into another language with specific parameters passed
 */
import Translate from "./translate";

/**
 * @param Debug: Main Debug Info Class which contains static methods to everything needed beforehand.
 * 
 * @param debugInfo: Formats the possible arguments into a format that can be sent as a Discord Message.
 * @param fetchDebugArguments: Asynchronously fetches the full list of debug arguments. This is its own function for ease of use.
 * @param sendDebugLog: Sends a debug log into the current channel with a list of options.
 */
import Debug from './debug';


/**
 * Main Miscellaneous Modules
 * @param externalPlugins: List of external plugin keys to be verified in @arg index.tsx and push down the Dislate button if any are found.
 * @param shadow: Native shadow implementation so that it can be changed from a single place.
 * @param filterColor: Takes an input color and returns a dark or light color if the contrast of the given color reaches a threshold.
 * @param displayToast: Opens a @arg Toast which informs the user that @arg {any} something has been copied to clipboard or @arg {opens} tooltip
 */
import Miscellaneous from './misc';

/**
 * @param ArrayImplementations: Main Custom Array Manipulation Implementations class which contains a bunch of static methods defined below
 * 
 * @param insertItem: Adds an item into an array at a given index.
 * @param findFtem: Searches for an item in an array based on a callback, and returns the item if found and undefined if not found.
 * @param forItem: Loops through an array and executes a callback for each iteration. This returns void.
 * @param mapItem: Loops through an array and executes a callback for each iteration, then concatenates the result of that callback to a new array. This returns a mapped array.
 * @param filterItem: Loops through an array and only adds the items on which the callback returns true. Returns a filtered array.
 */
import ArrayImplementations from './array_methods';

/**
 * @param Devices: Main Class to fetch device list and check if current device is compatible
 * 
 * @param getDeviceList: Fetches the full list of devices, formatted as an object. This is used for both @arg debugLog and @arg isCompatibleDevice
 * @param isCompatibleDevice: Checks if the current device is compatible (not a home button iPhone). If it is incompatible, open a dialog informing the user.
 */
import Devices from "./devices";

/**
 * @param tryCallback: Allows a function to be nested as a callback with a function label and optional call label.
 */
import tryCallback from "./try_callback";

/**
 * @param Store: Main class to set items to storage or settings and allow them to be cleared by button in Dislate afterwards.
 * 
 * @param item: Either sets a Setting or stores an item in Storage depending on the object passed, and also adds it to a list of state to be cleared from @arg {</dislate:1> type:Clear Stores} and from the @arg settings panel
 */
import Store from "./store_item";

/**
 * @param Icons: List of icons used throughout Dislate, all in a single Object to allow for changing easily.
 */
import Icons from "./icons";

/**
 * @param Format: Main Class to manipulate/format objects and strings.
 * 
 * @param string: Adds a capital letter to the beginning and replaces underscores with spaces in a @arg string.
 * @param object: Formats the specific return from the Device List GitHub Gist as a valid JSON object.
 * @param reverse: Returns a given object with the keys as the values and the values as the keys.
 */
import Format from "./format";

/**
 * @param Updater: Main class to check for Dislate Updates.
 * 
 * @param checkForUpdates: Checks for any updates that can be installed to Dislate.
 */
import Updater from "./update";

/**
 * Finally, export all of these functions. Other components in the code will be able to access these methods by accessing @arg index.ts afterwards
 */
export { 
    Translate,
    Debug,
    Miscellaneous,
    ArrayImplementations,
    Devices,
    tryCallback,
    Store,
    Icons,
    Format,
    Updater
};