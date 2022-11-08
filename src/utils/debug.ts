import { name, release, version, plugin } from '../../manifest.json'
import { Native } from 'enmity/metro/common'
import { get_device_list } from './devices'

async function fetch_debug_arguments() {
    let devices = await get_device_list() // get list of devices
    return {
        "Plugin Version": version,
        "Plugin Build": (plugin.build).split('-')[1],
        "Release Channel": release,
        "Discord Build": Native.InfoDictionaryManager.Version,
        "Software Version": Native.DCDDeviceManager.systemVersion,
        "Device": devices[Native.DCDDeviceManager.device]
    }
}

// returns an interpolated string lasting multiple lines of the debug info
async function debug_info(options: string[]) {
    const final_debug: string[] = [`**[${name}] Debug Information**`]
    const debug_list: { [key: string]: any; } = await fetch_debug_arguments()
    options.forEach((option: string) => {
        debug_list[option] 
            ? final_debug.push(`> **${option}**: ${debug_list[option]}`)
            : null
    })
    return final_debug.join('\n')
}

export { debug_info, fetch_debug_arguments }
