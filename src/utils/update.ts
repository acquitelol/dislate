/**
 * Imports
 * @param name: The name of the project, in this case being Dislate
 * @param plugin: Information about the plugin such as build, download link, and repo
 * @param version: The current latest version of the plugin
 * @param Dialog: The dialog module, to open alerts in app.
 * @param REST: The rest API to fetch the latest build from GitHub
 * @param reload: Function to force a reload on Discord.
 */
import { name, plugin, version } from '../../manifest.json';
import { Dialog, REST } from 'enmity/metro/common';
import { reload } from 'enmity/api/native';
import tryCallback from './try_callback';

/**
 * Checks if any updates are available.
 * @returns {void void}
 */
async function checkForUpdates(): Promise<void> {
    await tryCallback(async function () {
        /**
         * Gets a valid installation URL to fetch and see if the version is latest
         * @param {(constant)string} url: The url of the plugin to install.
         */
        const url = `${plugin.download}?${Math.floor(
            Math.random() * 1001
        )}.js`;

        /**
         * Gets the latest build source code as a string from the GitHub repo.
         * @param {object} res: The object of all information fetched from the REST api.
         * @param {string} content: The plugin source code as a string to check if the version is not the latest.
         */
        const res = await REST.get(url);
        const content = await res.text;

        /**
         * Gets the external version and build from the repo.
         * @param {string} externalVersion: The current latest version externally. Example: @arg {1.1.5}
         * @param {string} externalBuild: The current latest build externally. Example: @arg {patch-1.2.8}. This would be then shortened into a simpler string: @arg {1.2.8}
         */
        const externalVersion = content.match(/\d\.\d\.\d+/g)[0];
        const externalBuild = content.match(/patch-\d\.\d\.\d+/g)[0];

        /**
         * Returns early if it cannot find either of the versions from online and show the noUpdate dialog
         * @if {(@param externalVersion is falsey) <OR> (@param externalBuild is falsey)} -> Return early and show @arg noUpdates dialog.
         */
        if (!externalVersion || !externalBuild)
            return noUpdates(name, [version, plugin.build]);

        /**
         * Checks if the external version and build match the current version and build. The latest version takes priority over the latest build. If neither are found, then show @arg noUpdates dialog.
         * @if {(@param externalVersion is not equal to @param version)} -> Show update dialog with new @arg version as the newer update.
         * @elif {(@param externalBuild is not equal to @param plugin.build)} -> Show update dialog with new @arg build as the newer update.
         * @else {()} -> Return @arg noUpdates dialog, showing there are no new updates.
         *
         * @function showUpdateDialog: Shows that an update is available.
         * @arg {string} url: The url that the plugin will install with.
         * @arg {string} externalVersion: The latest version that the plugin will use as text
         * @arg {string} externalBuild: The latest version that the plugin will use as text
         * @arg {boolean}: Whether it's a version update or a build update.
         *
         */
        if (externalVersion != version) return showUpdateDialog(url, externalVersion, 'version');
        if (externalBuild != plugin.build) return showUpdateDialog(url, externalBuild.split('-')[1], 'build');
        return noUpdates(name, [version, plugin.build]);
    }, [plugin], name, 'checking if latest version at', 'the async check for updates callback');
}

/**
 * Shows a dialog that a new update is a available
 * @param {string} url: The url to update to the newer version
 * @param {string} updateLabel: The new version/build label to display in the dialogs.
 * @param {enum} updateType: The type of update, which is an @arg enum and has 2 states being @arg version and @arg build.
 * @returns {void}
 */
const showUpdateDialog = (url: string, updateLabel: string, updateType: string): void => {
    Dialog.show({
        title: 'Update found',
        body: `A newer ${updateType} is available for ${name}. ${updateType == 'build' ? `\nThe version will remain at ${version}, but the build will update to ${updateLabel}.` : ''}\nWould you like to install ${updateType} \`${updateLabel}\` now?`,
        confirmText: 'Update',
        cancelText: 'Not now',

        /**
         * Run the plugin install function.
         * @returns {void}
         */
        onConfirm: (): Promise<void> => installPlugin(url, updateLabel, updateType),
    });
};

/**
 * Opens a dialog showing that there are no updates available for @arg Dislate.
 * @param name: The name of the plugin, in this case its @arg Dislate.
 * @param { version, build }: This is an array of both the latest version and latest build, which are displayed in the @arg Dialog.
 * @returns {void}
 */
const noUpdates = (name: string, [version, build]: string[]): void => {
    console.log(`[${name}] Plugin is on the latest update, which is version ${version} and build ${build}`);
    Dialog.show({
        title: 'Already on latest',
        body: `${name} is already updated to the latest version.\nVersion: \`${version}\`\nBuild: \`${build.split('-')[1]}\``,
        confirmText: 'Okay',
    });
};

/**
 * Install a plugin and open a new @arg Dialog asking to @arg reload Enmity.
 * @param {string} url: The URL of the plugin to install.
 * @param {string} type: The @arg version or @arg build which it has just updated to, provided when the function is called dynamically.
 * @param {updateType} updateType: The type of update which is being installed, options are @arg version and @arg build updates.
 * @returns {void}
 */
async function installPlugin(url: string, type: string, updateType: string): Promise<void> {
    await tryCallback(async function () {
        /**
         * The main function to install a plugin, inside of Enmity. This function is not exported as a member in the Enmity library, so I have to manually import it.
         * @param {string} url: The link which is used to install the plugin
         * @param {string} data: The returned data which shows the state of the installation.
         * @ts-ignore */
        window.enmity.plugins.installPlugin(url, ({ data }) => {
            /**
             * Checks if @arg data is successful.
             * @if {(@arg data is @arg installed_plugin or @arg overridden_plugin)} -> Show a new @arg Dialog with a prompt to restart Enmity.
             * @else {()} -> Show an error log in @arg console describing that the plugin failed to update. This would only trigger if @arg data is @arg undefined or @arg fucky_wucky
             */
            data == 'installed_plugin' || data == 'overridden_plugin'
                ? Dialog.show({
                        title: `Updated ${name}`,
                        body: `Successfully updated to ${updateType} \`${type}\`. \nWould you like to reload Discord now?`,
                        confirmText: 'Reload',
                        cancelText: 'Not now',

                        /**
                         * Use the native @arg reload function to force crash Enmity.
                         * @returns {void}
                         */
                        onConfirm: (): void => reload(),
                    })
                : console.log(
                        `[Dislate] Plugin failed to update to ${updateType} ${type}.`
                    );
        });
    }, [url, type, updateType], name, 'installing plugin at', 'new version available');
}

export default {
    checkForUpdates,
    showUpdateDialog,
    noUpdates,
    installPlugin,
};
