/** 
 * Imports 
 * @param Storage: Enmity's storage API, to store and get data asynchronously
 * @param REST: Enmity's REST API, to fetch data from servers
 * @param {string} name: The name of the plugin from @arg manifest.json, in this case its Dislate.
 * @param Format.object: Convert an object to a JSON format, which requires some hacky alterations.
 * @param tryCallback: Function to wrap another function in a try-catch
 */
import { Dialog, Native, Storage } from "enmity/metro/common";
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

export default {
    getDeviceList
};
