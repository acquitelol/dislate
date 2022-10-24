import {name} from '../../manifest.json'
import { Native } from 'enmity/metro/common'
import { devices } from './devices'

// returns an interpolated string lasting multiple lines of the debug info
const debug_info = (version: string, release: string) => {
    return `**[${name}] Debug Information**
> **Plugin Version:** ${version}
> **Release Channel:** ${release}
> **Software Version:** ${Native.DCDDeviceManager.systemVersion}
> **Physical Device:** ${devices[Native.DCDDeviceManager.device]}`
}

export { debug_info }
