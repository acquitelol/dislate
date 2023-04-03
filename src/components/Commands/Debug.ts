import {
  ApplicationCommandType,
  ApplicationCommandInputType,
  ApplicationCommandOptionType,
} from "enmity/api/commands";
import { Dialog } from 'enmity/metro/common';
import { React, Toasts, Storage, Clipboard } from 'enmity/metro/common';
import { name, plugin } from '../../../manifest.json';
import { 
    Format, 
    Miscellaneous, 
    Icons,
    Translate
} from '../../common';
import { getByProps } from "enmity/metro";
import { get, set } from "enmity/api/settings";
import LanguageNames from '../../translate/languages/names';
import ISO from '../../translate/languages/iso';
import { renderActionSheet } from "../Modals/DebugInfoActionSheet";

const LazyActionSheet = getByProps("openLazy", "hideActionSheet");

const options = (channelName: string): any => {
    return {
        async debug() {
            return await new Promise(resolve => {
                renderActionSheet({
                    onConfirm: (debugLog: string, type: string) => {
                        LazyActionSheet.hideActionSheet()
                        Toasts.open({ 
                            content: `Sent ${type} in #${channelName}`, 
                            source: Icons.Settings.Toasts.Settings
                        })
            
                        resolve({ content: debugLog })
                    }, 
                    type: "send"
                })
            })
        },
        async example() {
            const englishContent = "Example Message. Enmity is a state or feeling of active opposition or hostility.";
            const randomLanguageIndex = Math.floor(Math.random() * (LanguageNames.length));
            const randomLanguageName = LanguageNames[randomLanguageIndex];

            const translatedContent = await Translate.string(
                englishContent,
                { 
                    fromLanguage: "detect", 
                    toLanguage: randomLanguageName,  
                },
                Object.assign({}, ...LanguageNames.map((k, i) => ({ [k]: ISO[i] })))
            );

            return await new Promise(resolve => {
                Dialog.show({
                    title: "Are you sure?",
                    body: `**This is a testing message.**\nYou are about to send the following:\n\n**English:** ${englishContent}\n\n**${Format.string(randomLanguageName)}:** ${translatedContent}\n\nAre you sure you want to send this? :3`,
                    confirmText: "Yep, send it!",
                    cancelText: "Nope, don't send it",
                    onConfirm: () => {                
                        Toasts.open({ 
                            content: `Sent test message in #${channelName}.`, 
                            source: Icons.Translate
                        });

                        resolve({ 
                            content: `**[${name}] Test Message**\n\n**English:** ${englishContent}\n**${Format.string(randomLanguageName)}:** ${translatedContent}` 
                        })
                    },
                    onCancel: () => {
                        Toasts.open({ 
                            content: `Cancelled translated message request.`, 
                            source: Icons.Cancel
                        });

                        resolve({});
                    },
                })
            })
        },
        async clearStores() {
            const storeItems: any = JSON.parse(get(name, "state_store", null) as string) ?? []

            for (let i = 0; i < storeItems.length; i++) {
                const item = storeItems[i]

                item.type==='storage'
                    ? await Storage.removeItem(item.name)
                    : set(name, item.name, item.override ?? false)
            }

            set(name, "state_store", null);

            Toasts.open({ 
                content: `Cleared all ${name} stores.`, 
                source: Icons.Settings.Toasts.Settings 
            });
        },
        async download() {
            return await new Promise(resolve => {
                Clipboard.setString(`${plugin.download}?${Math.floor(Math.random() * 1001)}.js`);
                Miscellaneous.displayToast("download link", 'clipboard');
                resolve({})
            })
        }
    }
}

const commandOptions = Object.keys(options("placeholder"))
    .map((item: string) => ({
        name: Format.string(item, true),
        displayName: Format.string(item, true),
        value: item
    }))

export default {
    id: `${name?.toLowerCase()}`,
    name: `${name?.toLowerCase()}`,
    displayName: `${name?.toLowerCase()}`,
    description: `Choose from a list of options for debugging in ${name}.`,
    displayDescription: `Choose from a list of options for debugging in ${name}.`,
    type: ApplicationCommandType.Chat,
    inputType: ApplicationCommandInputType.BuiltInText,
    options: [{
        name: "type",
        displayName: "type",
        description: "The type of command to execute.",
        displayDescription: "The type of command to execute.",
        type: ApplicationCommandOptionType.String,
        choices: [...commandOptions],
        required: true,
    }],

    async execute(args, context) {
        const commandType = args.find((o: any) => o.name === "type").value
        const availableOptions = options(context.channel.name);
        const throwToast = () => {
            Toasts.open({ content: 'Invalid command argument.', source: Icons.Clock });
        };

        const chosenOption = availableOptions[commandType] ?? throwToast;
        return await chosenOption();
    },
};