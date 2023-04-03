import { name, release, version, plugin } from '../../manifest.json';
import { Native, React } from 'enmity/metro/common';
import { device } from 'enmity/api/native';
import tryCallback from './try_callback';
import { getByProps } from 'enmity/metro';

type debugArguments = { [key: string]: string | undefined | debugArguments; }

async function fetchDebugArguments(): Promise<debugArguments> {
    // @ts-expect-error
    const Hermes = window.HermesInternal.getRuntimeProperties()
    const ReactNative = getByProps("View", "Text");
    const ReactNativeConstants = ReactNative.Platform.constants
    const ReactNativeVersion = ReactNativeConstants.reactNativeVersion

    return {
        "Plugin": {
            "Version": version,
            "Build": plugin.hash,
            "Channel": release,
        },
        "Client": {
            "Version": Native.InfoDictionaryManager.Version,
            "Build": Native.InfoDictionaryManager.Build,
            "Release": Native.InfoDictionaryManager.ReleaseChannel,
            "Bundle": (Native.InfoDictionaryManager.Identifier).split('.')[2],
        },
        "React": {
            "Version": React.version,
            "Bytecode": Hermes['Bytecode Version'],
            "Hermes": Hermes['OSS Release Version'],
            "Native": `${ReactNativeVersion.major ?? 0}.${ReactNativeVersion.minor ?? 0}.${ReactNativeVersion.patch ?? 0}`
        },
        "Native": {
            "Version": Native.DCDDeviceManager.systemVersion,
            "Device": device,
            "Manufacturer": Native.DCDDeviceManager.deviceManufacturer,
            "Idiom": ReactNativeConstants['interfaceIdiom']
        }
    }
}

async function debugInfo(options: any, label?: string): Promise<string> {
    return await tryCallback(async function() {
        let finalDebug: string[] = [`**[${name}] Debug Information**\n`]
        const debugList: { [key: string]: any; } = await fetchDebugArguments()

        Object.keys(options).forEach((option: string) => {
            if (Object.values(options[option]).some(subOptionValue => subOptionValue))
                finalDebug.push(`[**${option}**]`);

            Object.keys(options[option]).forEach((subOption: string) => {
                if (options[option][subOption] && debugList[option][subOption])
                    finalDebug.push(`> **${subOption}**: ${debugList[option][subOption]}`)
            })
        })

        return finalDebug.join('\n')
    }, [options], name, 'creating debug info at', label)
}

export default {
    fetchDebugArguments,
    debugInfo,
};