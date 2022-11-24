/**
 * Imports
 * @param Dialog: Allows you to show a native Discord Dialog
 * @param Native: Allows you to use Native strings such as the OS version and Device ID.
 * @param Storage: Allows you to store and retrieve data asynchronously in any type
 * @param name: The name of the plugin, in this case it's Dislate.
 * @param get_device_list: Function to grab a JSON list of available devices to fetch a regular device string instead of a Device ID.
 * @param store_item: Allows you to store an item and allow it to be cleared by the clear store option in settings
 * @param try_callback: Allows you to wrap code in a try-catch easily.
 */
import { Dialog, Native, Storage } from "enmity/metro/common";
import { name } from '../../manifest.json'
import { get_device_list } from "./devices";
import { store_item } from "./store_item";
import { try_callback } from "./try_callback";

/** Checks if your current device is compatible and shows a one-time Dialog if it isn't, as an excuse for any issues.
 * @param {string?} label: A label to describe what it might be fetching
 * @returns {void}
 */
async function check_if_compatible_device( label?: string ) {
    await try_callback(async function() {
        /** Gets the current device and the list of devices
         * @param {string} device: The current user's device.
         * @param {object} devices: The list of all possible devices.
         */
        let device: string = Native.DCDDeviceManager.device;
        let devices: any = await get_device_list();
        
        /** Returns early if the device is not an iPhone as iPads do not have this issue
         * @if {(@param {string} device does not include: @arg iPhone)} -> Return early
         */
        if (!device.includes("iPhone")) return;

        /** Formats the current device into a float so it can be compared.
         * @param {number} device: User's device formatted as a floating point number, still in a @arg string format. @arg {example}: "iPhone 12,8" -> "12.8"
         * @param {(constant) number | undefined} device_float: Device casted from a @arg string into an actual @arg float.
         */
        device = device.replace('iPhone', '').replace(',', '.')
        const device_float: number | undefined = parseFloat(device)

        /** Opens a dialog showing that device is incompatible and never shows again after you click "I understand" (Can be cleared by clearing the store in settings)
         * @returns {void}
         */
        async function open_incompatible_dialog(): Promise<void> {
            const shown_already = await Storage.getItem('dislate_incompatible_dialog')

            /** Open a Dialog with content that your iPhone is incompatible
             * @param {string} devices[Native.DCDDeviceManager.device]: The user's device in a human readable format.
             * @param {string} name: The name of the plugin from manifest.json
             */
            shown_already ?? Dialog.show({
                title: "Incompatible iPhone",
                body: `Please note that you're on an${devices[Native.DCDDeviceManager.device]}.\nSome features of ${name} may behave in an unexpected manner.`,
                confirmText: "I understand",
                onConfirm: await store_item(
                    {   
                        name: 'dislate_incompatible_dialog', 
                        content: 'never show again until cleared',
                        type: 'storage'
                    }, 
                    'storing incompatible dialog to storage'
                )
            })
        }

        /**
         * Checks if the device is incompatible (lower than 10,6 but not 10,3 as thats iPhone X Global, and also matches 14.6 and 12.8 as they are SE iPhones)
         * @param {float} device_float: The user's current device formatted as a float to be compared to other floats.
         * 
         * @if {(@arg device_float is less than @arg {10.6}, but is not equal to @arg {10.3 (iPhone X Global)})} -> Open dialog showing that current device is incompatible.
         * @elif {(@arg device_float is @arg {12.8 (iPhone SE 2nd Gen)} or @arg {14.6 (iPhone SE 3rd Gen)})} -> Open dialog showing that current device is incompatible.
         * @else {()} -> Return @arg null.
         */
        (device_float < 10.6 && device_float != 10.3) ||
        (device_float == 14.6 || device_float == 12.8)
            ? open_incompatible_dialog()
            : null;
    }, [], name, 'checking if device is compatible', label)
}

export {check_if_compatible_device}