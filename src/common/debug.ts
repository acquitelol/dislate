/**
 * Imports 
 * @param {string{}} Manifest: The strings required from manifest.json
 * @param {unknown} Native: The Native component
 * @param {function} Devices.getDeviceList: The async function to get the device list from an API or from Storage.
 * @param {function} ArrayOps: Main class to perform array manipulations
 * @param tryCallback: Function to wrap another function in a try-catch
 */
import { name, release, version, plugin } from '../../manifest.json';
import { Native, React } from 'enmity/metro/common';
import Devices from './devices';
import ArrayOps from './array_methods';
import tryCallback from './try_callback';

type debugArguments = { [key: string]: string | undefined | debugArguments; }

/** 
 * Fetches the debug arguments. This is used in a lot of functions, and adding anything here will change it everywhere.
 * @returns {Promise<{ [key: string]: string | undefined; }>}
 */
async function fetchDebugArguments(): Promise<debugArguments> {
    /** 
     * Gets the list of devices asynchronously from the function
     * @param {object} devices: The formatted list of devices from the API.
     */
    const devices = await Devices.getDeviceList()
    return {
        "Plugin": {
            "Version": version,
            "Build": (plugin.build).split('-')[1],
            "Channel": release,
        },
        "Client": {
            "Version": Native.InfoDictionaryManager.Version,
            "Build": Native.InfoDictionaryManager.Build,
            "Release": Native.InfoDictionaryManager.ReleaseChannel,
            "Bundle": (Native.InfoDictionaryManager.Identifier).split('.')[2],
        },
        "Native": {
            "Version": Native.DCDDeviceManager.systemVersion,
            "Device": devices[Native.DCDDeviceManager.device],
            "Manufacturer": Native.DCDDeviceManager.deviceManufacturer
        }
    }
}

/** 
 * Returns an interpolated string lasting multiple lines of the debug information depending on how many options were chosen in the Debug command. All unconventional methods such as copying in Settings will choose all of the options.
 * @param {string[]} options: The array of options, as strings.
 * @param {string?} label: The label of the function when called. This may be undefined.
 * @returns {Promise<string>};
 */
async function debugInfo(options: any, label?: string): Promise<string> {
    return await tryCallback(async function() {
        /** 
         * Creates an "empty" array with only the default header
         * @param {string[]} finalDebug: The final array of items which will be joined into a string.
         * @param { { [key: string]: any; } } debugList: The full list of debug arguments
         */
        let finalDebug: string[] = [`**[${name}] Debug Information**\n`]
        const debugList: { [key: string]: any; } = await fetchDebugArguments()

        ArrayOps.forItem(Object.keys(options), (option: string) => {
            /**
             * Only add the Option as a title if at least 1 of the values of the subOptions are true.
             * This is done using the @arg Array.prototype.some method.
             */
            Object.values(options[option]).some(subOptionValue => subOptionValue)
                ? ArrayOps.insertItem(finalDebug, `[**${option}**]`, finalDebug.length, 'pushing to debug argument array')
                : null;

            ArrayOps.forItem(Object.keys(options[option]), (subOption: string) => {
                /** 
                 * Only pushes to the new array for each option that exists in the debug list
                 * @uses @param {string} option: The string option that will be checked to see if exists in the array.
                 */
                (options[option][subOption] && debugList[option][subOption])
                    ?   ArrayOps.insertItem(finalDebug, `> **${subOption}**: ${debugList[option][subOption]}`, finalDebug.length, 'pushing to debug argument array')
                    :   null
            })
        }, 'looping through debug options')

        /** 
         * Return the final array of items, joined together by \n.
         * @param {string} finalDebug: The final debug information
         */
        return finalDebug.join('\n')
    }, [options], name, 'creating debug info at', label)
}

export default {
    fetchDebugArguments,
    debugInfo,
};