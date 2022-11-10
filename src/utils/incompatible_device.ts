import { Dialog, Native, Storage } from "enmity/metro/common";
import { name } from '../../manifest.json'
import { get_device_list } from "./devices";

async function check_if_compatible_device () {
    let device = Native.DCDDeviceManager.device; // current device
    let devices = await get_device_list() // list of devices
    
    // first check if the device is an iPhone as this issue only occurs on iPhone models
    if (device.includes("iPhone")) { 
        device = device.replace('iPhone', '') // remove the word iPhone (iPhone12,8) -> (12,8)
        device = device.replace(',', '.') // replace the comma (,) with a dot (.) to make the number formattable as a float
        if (
            // checks all iphones under iPhone X which arent "iPhone X Global"
            (parseFloat(device)<10.6&&parseFloat(device)!=10.3)
            // also triggers if the device is iPhone SE 3rd Gen or 2nd Gen
            || parseFloat(device)==14.6
            || parseFloat(device)==12.8
        ) {
            const shown_already = await Storage.getItem('dislate_incompatible_dialog')

            // opens a dialog showing the message that the iPhone model in question may cause issues.
            shown_already ?? Dialog.show({
                title: "Incompatible iPhone",
                body: `Please note that you're on an${devices[Native.DCDDeviceManager.device]}.
Some features of ${name} may behave in an unexpected manner.`,
                confirmText: "I understand",
                onConfirm: await Storage.setItem('dislate_incompatible_dialog', 'never showing again until cleared store')
            })
        }
    }
}

export {check_if_compatible_device}