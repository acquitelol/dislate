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
    let external_version = content.match(/[0-9].[0-9].[0-9]/g);
    if (!external_version) return;

    // format the remote version
    external_version = external_version[0].replaceAll('"', "");
    external_version != version ? show_update_dialog(url, external_version) : no_updates(name, version)
    return
}

const show_update_dialog = (url: string, version: string) => {
    Dialog.show({
        title: "Update found",
        body: `Update has been found for ${name}.
Would you like to install version ${version} now?`,
        confirmText: "Update",
        cancelText: "Not now",
        onConfirm: () => install_plugin(url, version),
    });
}

const no_updates = (name: string, version: string) => {
    console.log(`${name} is on the latest version, which is version ${version}`)
    Toasts.open({ content: `${name} is on latest version (${version})`, source: Icons.Clipboard });
}

async function install_plugin(url: string, version: string) {
    //@ts-ignore
    window.enmity.plugins.installPlugin(url, ({ data }) => {
        data=="installed-plugin" || data=="overriden-plugin" ? Dialog.show({
            title: `Updated ${name}`,
            body: `Successfully updated to version ${version}. 
Would you like to reload Discord now?`,
            confirmText: "Reload",
            cancelText: "Not now",
            onConfirm: () => {reload()},
        }) : console.log(`[Dislate] Plugin failed to update to version ${version}.`)
    })
}

export {check_for_updates}