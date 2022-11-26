/** 
 * Imports
 * @param name: The name of the project, in this case being Dislate
 * @param plugin: Information about the plugin such as build, download link, and repo
 * @param version: The current latest version of the plugin
 * @param Dialog: The dialog module, to open alerts in app.
 * @param REST: The rest API to fetch the latest build from GitHub
 * @param reload: Function to force a reload on Discord.
 */
import { name, plugin, version } from "../../manifest.json";
import { Dialog, REST } from "enmity/metro/common";
import { reload } from "enmity/api/native";
import { try_callback } from "./try_callback";
import { FormDivider, FormRow, FormSection, FormSwitch, Text } from 'enmity/components';

/** 
 * An enumerator to choose whether the type of update is a version or a build update.
 * @param {enum} version: The @arg version part of the enum
 * @param {enum} build: The @arg build part of the enum
 */
enum updateType {
    version,
    build
}

/**
 * Checks if any updates are available.
 * @returns {void void}
 */
async function check_for_updates() {
    await try_callback(async function() {
        /** 
         * Gets a valid installation URL to fetch and see if the version is latest
         * @param {(constant)string} url: The url of the plugin to install.
         */
        const url = `${plugin.download}?${Math.floor(Math.random() * 1001)}.js`

        /** 
         * Gets the latest build source code as a string from the GitHub repo.
         * @param {object} res: The object of all information fetched from the REST api.
         * @param {string} content: The plugin source code as a string to check if the version is not the latest.
         */
        const res = await REST.get(url);
        const content = await res.text;

        /** 
         * Gets the external version and build from the repo.
         * @param {string} external_version: The current latest version externally. Example: @arg {1.1.5}
         * @param {string} external_build: The current latest build externally. Example: @arg {patch-1.2.8}. This would be then shortened into a simpler string: @arg {1.2.8}
         */
        const external_version = content.match(/\d\.\d\.\d+/g)[0];
        const external_build = content.match(/patch\-\d\.\d\.\d+/g)[0];

        /** 
         * Returns early if it cannot find either of the versions from online and show the no_update dialog
         * @if {(@param external_version is falsey) <OR> (@param external_build is falsey)} -> Return early and show @arg no_updates dialog.
         */
        if (!external_version || !external_build) return no_updates(name, [version, plugin.build]);

        /** 
         * Checks if the external version and build match the current version and build. The latest version takes priority over the latest build. If neither are found, then show @arg no_updates dialog.
         * @if {(@param external_version is not equal to @param version)} -> Show update dialog with new @arg version as the newer update.
         * @elif {(@param external_build is not equal to @param plugin.build)} -> Show update dialog with new @arg build as the newer update.
         * @else {()} -> Return @arg no_updates dialog, showing there are no new updates.
         * 
         * @function show_update_dialog: Shows that an update is available.
                * @arg {string} url: The url that the plugin will install with.
                * @arg {string} external_version: The latest version that the plugin will use as text 
                * @arg {string} external_build: The latest version that the plugin will use as text
                * @arg {boolean}: Whether it's a version update or a build update.
         * 
         */
        if (external_version != version) return show_update_dialog(url, external_version, updateType.version)
        if (external_build != plugin.build) return show_update_dialog(url, external_build.split('-')[1], updateType.build)
        return no_updates(name, [version, plugin.build])
    }, [plugin], name, 'checking if latest version at', "the async check for updates callback")
}

/** 
 * Shows a dialog that a new update is a available
 * @param url: The url to update to the newer version
 * @param version: The newer version to update to (may be @arg undefined)
 * @param build: The newer build to update to (may be @arg undefined)
 * @param update_type: The type of update, which is an @arg enum and has 2 states being @arg version and @arg build.
 * @returns {void}
 */
const show_update_dialog = (url: string, type: string, update_type: updateType) => {
    const update_boolean: boolean = update_type==updateType.build
    Dialog.show({
        title: "Update found",
        body: `A newer ${update_boolean ? "build" : "version"} is available for ${name}. ${update_boolean ? `\nThe version will remain at ${version}, but the build will update to ${type}.` : ""}\nWould you like to install ${update_boolean ? `build` : `version`} \`${type}\` now?`,
        confirmText: "Update",
        cancelText: "Not now",
        
        /**
         * Run the plugin install function.
         * @returns {void}
         */
        onConfirm: (): Promise<void> => install_plugin(url, type, update_type),
    });
}

/**
 * Opens a dialog showing that there are no updates available for @arg Dislate.
 * @param name: The name of the plugin, in this case its @arg Dislate.
 * @param types: This is an array of both the latest version and latest build, which are displayed in the @arg Dialog.
 * @returns {void}
 */
const no_updates = (name: string, types: string[]) => {
    console.log(`[${name}] Plugin is on the latest update, which is version ${types[0]} and build ${types[1]}`)
    Dialog.show({
        title: "Already on latest",
        body: `${name} is already updated to the latest version, which is \`${types[0]}\`, and latest build, which is \`${types[1].split('-')[1]}\``,
        confirmText: "Okay",
    });
}

/**
 * Install a plugin and open a new @arg Dialog asking to @arg reload Enmity.
 * @param {string} url: The URL of the plugin to install.
 * @param {string} type: The @arg version or @arg build which it has just updated to, provided when the function is called dynamically.
 * @param {updateType} update_type: The type of update which is being installed, options are @arg version and @arg build updates.
 * @returns {void}
 */
async function install_plugin(url: string, type: string, update_type: updateType) {
    await try_callback(async function() {
        /**
         * The main function to install a plugin, inside of Enmity. This function is not exported as a member in the Enmity library, so I have to manually import it.
         * @param url: The link which is used to install the plugin
         * @param {data}: The returned data which shows the state of the installation.
         * @ts-ignore */
        window.enmity.plugins.installPlugin(url, ({ data }) => {
            /**
             * Checks if @arg data is successful.
             * @if {(@arg data is @arg installed_plugin or @arg overridden_plugin)} -> Show a new @arg Dialog with a prompt to restart Enmity.
             * @else {()} -> Show an error log in @arg console describing that the plugin failed to update. This would only trigger if @arg data is @arg undefined or @arg fucky_wucky
             */
            data=="installed_plugin" || data=="overridden_plugin" 
                ?   Dialog.show({
                        title: `Updated ${name}`,
                        body: `Successfully updated to ${update_type==updateType.build ? `build` : `version` } \`${type}\`. \nWould you like to reload Discord now?`,
                        confirmText: "Reload",
                        cancelText: "Not now",

                        /**
                         * Use the native @arg reload function to force crash Enmity.
                         * @returns {void}
                         */
                        onConfirm: (): void => reload(),
                    }) 
                :   console.log(`[Dislate] Plugin failed to update to ${update_type==updateType.build ? `build` : `version`} ${type}.`)
        })
    }, [url, type, update_type], name, 'installing plugin at', 'new version available')
}

export {check_for_updates}