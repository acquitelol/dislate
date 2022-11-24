/** Imports 
 * @param Storage: Enmity's storage API, to store and get data asynchronously
 * @param REST: Enmity's REST API, to fetch data from servers
 * @param {string} name: The name of the plugin from @arg manifest.json, in this case its Dislate.
 * @param format_object: Convert an object to a JSON format, which requires some hacky alterations.
 * @param try_callback: Function to wrap another function in a try-catch
 */
import { REST, Storage } from "enmity/metro/common";
import { name } from '../../manifest.json'
import { format_object } from "./format_object";
import { store_item } from "./store_item";
import { try_callback } from "./try_callback";

/** Fetches the list of clear device names to be used in Debug Information.
 * @param {string?} label: The label to determine any errors. Can be undefined.
 * @returns {{ [key: string]: string | undefined; }}
 */
async function get_device_list(label?: string): Promise<any> {
    return await try_callback(async function(): Promise<{ [key: string]: string | undefined; }> {
        /** Attempt to find the existing list in storage. If it exists already then just return that.
         * @param {object?} existing: The possible list of devices from storage. Can be undefined.
         */
        const existing = await Storage.getItem("device_list")
        if (existing) return JSON.parse(existing);

        /** If it reaches this point, this means that it did not find any 
         * @param {JSON} res: The data returned from the API
         * @param {string} device_list: The list of devices as text from the API.
         */
        let res = await REST.get(`https://gist.githubusercontent.com/adamawolf/3048717/raw/1ee7e1a93dff9416f6ff34dd36b0ffbad9b956e9/Apple_mobile_device_types.txt`);
        let devices_list = res.text;

        /** Formats the list into a JSON { [key: string]: value } pair
         * @param {string} formatted_list: An array of devices in a  format which can be formatted with @arg JSON.parse
         */
        let formatted_list = format_object(devices_list)

        /** 
         * Set the list to Storage asynchronously as a string 
         */
        await store_item(
            {
                name: "device_list",
                content: formatted_list,
                type: 'storage'
            },
            "storing device list in storage"
        )

        /** Fetch the list from storage which it just set. You could just return the formatted_list but this method also ensures that Storage is working correctly.
         * @param device_list: The list of devices fetched from Storage.
         */
        return JSON.parse(await Storage.getItem("device_list"))
    }, [], name, "get the device list", label)
}


export {get_device_list}