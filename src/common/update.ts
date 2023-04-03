import { name, plugin, version } from '../../manifest.json';
import { Dialog } from 'enmity/metro/common';
import { reload } from 'enmity/api/native';
import tryCallback from './try_callback';

async function checkForUpdates(): Promise<void> {
    await tryCallback(async function () {
        const url = `${plugin.download}?${Math.floor(Math.random() * 1001)}.js`;
        const res = await fetch(url);
        const content = await res.text() as string;

        const potentialExternalVersion = content.match(/\d+\.\d+\.\d+/g)
        const potentialExternalHash = content.match(/hash:"(.*?)"/)

        if (!potentialExternalVersion && !potentialExternalHash)
            return failureUpdate(name, [version, plugin.build]);

        const externalVersion = potentialExternalVersion && potentialExternalVersion[0];
        const externalHash = potentialExternalHash && potentialExternalHash[1]

        if (externalVersion && (externalVersion != version)) return showUpdateDialog(url, externalVersion, 'version');
        if (externalHash && (externalHash != plugin.hash)) return showUpdateDialog(url, externalHash, "build");
        return noUpdates(name, [version, plugin.hash]);
    }, [plugin], name, 'checking if latest version at', 'the async check for updates callback');
}

const showUpdateDialog = (url: string, updateLabel: string, updateType: string): void => {
    Dialog.show({
        title: 'Update found',
        body: `A newer ${updateType} is available for ${name}. ${
            updateType == 'build' 
                ? `\nThe version will remain at ${version}, but the build will update to ${updateLabel}.` 
                : ''
        }\nWould you like to install ${updateType} \`${updateLabel}\` now?`,
        confirmText: 'Update',
        cancelText: 'Not now',
        onConfirm: (): Promise<void> => installPlugin(url, updateLabel, updateType),
    });
};

const noUpdates = (name: string, [version, hash]: string[]): void => {
    console.log(`[${name}] Plugin is on the latest update, which is version ${version} and build ${hash}`);
    Dialog.show({
        title: 'Already on latest',
        body: `${name} is already updated to the latest version.\nVersion: \`${version}\`\nBuild: \`${hash}\``,
        confirmText: 'Okay',
    });
};

const failureUpdate = (name: string, [version, hash]: string[]): void => {
    console.log(`[${name}] Plugin failed to update to the latest version and build, remaining at ${version} and ${hash}`);
    Dialog.show({
        title: 'Failed',
        body: `${name} to find a new version or build.\nThe current versions will remain as follows:\nVersion: \`${version}\`\nBuild: \`${hash}\``,
        confirmText: 'Okay',
    });
};

async function installPlugin(url: string, type: string, updateType: string): Promise<void> {
    await tryCallback(async function () {
        // @ts-expect-error
        window.enmity.plugins.installPlugin(url, ({ data }) => {
            data == 'installed_plugin' || data == 'overridden_plugin'
                ? Dialog.show({
                        title: `Updated ${name}`,
                        body: `Successfully updated to ${updateType} \`${type}\`. \nWould you like to reload Discord now?`,
                        confirmText: 'Reload',
                        cancelText: 'Not now',
                        onConfirm: (): void => reload(),
                    })
                : console.log(`[${name}] Plugin failed to update to ${updateType} ${type}.`);
        });
    }, [url, type, updateType], name, 'installing plugin because', 'new version available');
}

export default {
    checkForUpdates
};
