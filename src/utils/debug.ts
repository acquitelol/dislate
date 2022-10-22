import {name} from '../../manifest.json'

// returns an interpolated string lasting multiple lines of the debug info
const debugInfo = (version: string, release: string) => {
    return `
            **[${name}] Debug Information**
> **Version:** ${version}
> **Channel:** ${release}
            `
}

export { debugInfo }
