// Dependencies used in the script
import { name, plugin, version } from "../../manifest.json";
import { Dialog, REST, Toasts } from "enmity/metro/common";
import { reload } from "enmity/api/native";
import { Icons } from './icons';

async function check_for_updates() {
    // get the plugin source
    const url = `${plugin[0].download}?${Math.floor(Math.random() * 1001)}.js`

    const res = await REST.get(url);
    const content = await res.text;

    // get the version from the source
    let external_version = content.match(/\d\.\d\.\d\d?/g);
    if (!external_version) return;

    /* 
    i dont need to match specific parts of the version, here are some tests~
       -> version 1.1.6, latest is 1.1.9 (not the same so update)
       -> version 1.1.7 latest is 1.3.2 (not the same so update)
       -> version 1.2.5 latest is 1.2.5 (is the same so no update)
    ~ theres no need to match for if the latest is higher than the current 
      because the latest will always be larger or equal to the current version
    */

    // if the version is not the current one, that means its newer, otherwise run the no update function
    external_version != version ? show_update_dialog(url, external_version) : no_updates(name, version)
    return // finish the function
}

const show_update_dialog = (url: string, version: string) => {
    // open a dialog to show that a new version is available
    Dialog.show({
        title: "Update found",
        body: `A newer version is available for ${name}.\nWould you like to install version ${version} now?`,
        confirmText: "Update",
        cancelText: "Not now",
        
        // run the install function
        onConfirm: () => install_plugin(url, version),
    });
}

const no_updates = (name: string, version: string) => {
    // logs the fact that youre on the latest version with both a toast a
    console.log(`[${name}] Plugin is on the latest version, which is version ${version}`)
    Toasts.open({ content: `${name} is on latest version (${version})`, source: Icons.Clipboard });
}

async function install_plugin(url: string, version: string) {
    //@ts-ignore
    window.enmity.plugins.installPlugin(url, ({ data }) => {
        // as a callback, waits for a success of "installed-plugin" or "overriden-plugin"
        // before showing the dialog to reload discord
        data=="installed_plugin" || data=="overridden_plugin" ? Dialog.show({
            title: `Updated ${name}`,
            body: `Successfully updated to version ${version}. \nWould you like to reload Discord now?`,
            confirmText: "Reload",
            cancelText: "Not now",
            // reload discord from native function
            onConfirm: () => {reload()},
        }) : console.log(`[Dislate] Plugin failed to update to version ${version}.`)
        // otherwise log an issue when updating to console ^^^
    })
}

export {check_for_updates}