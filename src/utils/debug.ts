import {name} from '../../manifest.json'

// returns an interpolated string lasting multiple lines of the debug info
const debug_info = (version: string, release: string) => {
    return `
            **[${name}] Debug Information**
> **Version:** ${version}
> **Channel:** ${release}
            `
}

export { debug_info }
