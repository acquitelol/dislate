import { Dialog, Native } from "enmity/metro/common";
import { name } from '../../manifest.json'
import { init_device_list } from "./devices";

async function check_if_compatible_device () {
    let device = Native.DCDDeviceManager.device;
    let devices = await init_device_list()
    
    console.log(devices)
    if (device.includes("iPhone")) { 
        device = device.replace('iPhone', '')
        device = device.replace(',', '.')
        if (parseFloat(device)<10.5) {
            Dialog.show({
                title: "Incompatible iPhone",
                body: `Please note that you're on an${devices[Native.DCDDeviceManager.device]}.
Some features of ${name} may behave in an unexpected manner.`,
                confirmText: "I understand",
            })
        }
    }
}

export {check_if_compatible_device}