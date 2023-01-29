/** 
 * Imports 
 * @param Storage: Enmity's storage API, to store and get data asynchronously
 * @param REST: Enmity's REST API, to fetch data from servers
 * @param {string} name: The name of the plugin from @arg manifest.json, in this case its Dislate.
 * @param Format.object: Convert an object to a JSON format, which requires some hacky alterations.
 * @param tryCallback: Function to wrap another function in a try-catch
 */
import { Dialog, Native, REST, Storage } from "enmity/metro/common";
import { name } from '../../manifest.json';
import Format from "./format";
import Store from './store_item';
import tryCallback from './try_callback';

/** 
 * Fetches the list of clear device names to be used in Debug Information.
 * @returns {{ [key: string]: string | undefined; }}
 */
async function getDeviceList(label?: string): Promise<any> {
    return await tryCallback(async function(): Promise<{ [key: string]: string | undefined; }> {
        /** 
         * Attempt to find the existing list in storage. If it exists already then just return that.
         * @param {object?} existing: The possible list of devices from storage. May be undefined.
         */
        const existing = await Storage.getItem("device_list")
        if (existing) return JSON.parse(existing);

        /** 
         * If it reaches this point, this means that it did not find any existing list in Storage.
         * @param {(string) object} res: The data returned from the API
         * @param {string} devicesList: The list of devices as text from the API.
         */
        const res = await fetch(`https://gist.githubusercontent.com/adamawolf/3048717/raw/1ee7e1a93dff9416f6ff34dd36b0ffbad9b956e9/Apple_mobile_device_types.txt`);
        const devicesList = await res.text();

        /** 
         * Formats the list into a JSON { [key: string]: value } pair
         * @param {string} formattedList: An array of devices in a  format which can be formatted with @arg JSON.parse
         * 
         * @uses @param formattedList: The list of devices fetched from Storage.
         */
        const formattedList = Format.object(devicesList, 'fetching device list')

        /** 
         * Set the list to Storage asynchronously as a string 
         */
        await Store.item(
            {
                name: "device_list",
                content: formattedList,
                type: 'storage'
            },
            "storing device list in storage"
        )

        /** 
         * Fetch the list from storage which it just set. You could just return the formattedList but this method also ensures that Storage is working correctly.
         * @uses @param deviceList: The list of devices fetched from Storage.
         */
        return JSON.parse(await Storage.getItem("device_list"))
    }, [], name, "get the device list", label)
}

/** 
 * Checks if your current device is compatible and shows a one-time Dialog if it isn't, as an excuse for any issues.
 * @returns {Promise<void>}
 */
async function isCompatibleDevice(label?: string): Promise<void> {
    await tryCallback(async function() {
        /** 
         * Gets the current device and the list of devices
         * @param {string} device: The current user's device.
         * @param {object} devices: The list of all possible devices.
         */
        let device: string = Native.DCDDeviceManager.device;
        let devices: any = await getDeviceList();
        
        /** 
         * Returns early if the device is not an iPhone as iPads do not have this issue
         * @if {(@param {string} device does not include: @arg iPhone)} -> Return early
         */
        if (!device.includes("iPhone")) return;

        /** 
         * Formats the current device into a float so it can be compared.
         * @param {number} device: User's device formatted as a floating point number, still in an @arg string format. @arg {example}: "iPhone 12,8" -> "12.8"
         * @param {(constant) number | undefined} deviceFloat: Device casted from an @arg string into an actual @arg float.
         */
        device = device.replace('iPhone', '').replace(',', '.')
        const deviceFloat: number | undefined = parseFloat(device)

        /** 
         * Opens an @arg Dialog showing that device is incompatible and never shows again after you click "I understand" (Can be cleared by clearing the store in settings)
         * @returns {void}
         */
        async function openIncompatibleDialog(): Promise<void> {
            const shownAlready = await Storage.getItem('dislate_incompatible_dialog')

            /** 
             * Open a Dialog with content that your iPhone is incompatible
             * @uses @param {string} devices[Native.DCDDeviceManager.device]: The user's device in a human readable format.
             * @uses @param {string} name: The name of the plugin from manifest.json
             */
            shownAlready ?? Dialog.show({
                title: "Incompatible iPhone",
                body: `Please note that you're on an${devices[Native.DCDDeviceManager.device]}.\nSome features of ${name} may behave in an unexpected manner.`,
                confirmText: "I understand",
                onConfirm: await Store.item(
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
         * @uses @param {float} deviceFloat: The user's current device formatted as a float to be compared to other floats.
         * 
         * @if {(@arg deviceFloat is less than @arg {10.6}, but is not equal to @arg {10.3 (iPhone X Global)})} -> Open dialog showing that current device is incompatible.
         * @elif {(@arg deviceFloat is @arg {12.8 (iPhone SE 2nd Gen)} or @arg {14.6 (iPhone SE 3rd Gen)})} -> Open dialog showing that current device is incompatible.
         * @else {()} -> Return @arg null.
         */
        (deviceFloat < 10.6 && deviceFloat != 10.3) || (deviceFloat == 14.6 || deviceFloat == 12.8)
            ? await openIncompatibleDialog()
            : null;
    }, [], name, 'checking if device is compatible', label)
};

export default {
    getDeviceList,
    isCompatibleDevice
};
