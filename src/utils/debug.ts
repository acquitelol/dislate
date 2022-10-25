import { name } from '../../manifest.json'
import { Native } from 'enmity/metro/common'
import { get_device_list } from './devices'

// returns an interpolated string lasting multiple lines of the debug info
async function debug_info (version: string, release: string) {
    let devices = await get_device_list() // get list of devices
    
    return `**[${name}] Debug Information**
> **Plugin Version:** ${version}
> **Release Channel:** ${release}
> **Software Version:** ${Native.DCDDeviceManager.systemVersion}
> **Device:** ${devices[Native.DCDDeviceManager.device]}`
}

export { debug_info }
