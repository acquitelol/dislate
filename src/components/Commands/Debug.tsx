/** 
 * Imports
 * @param { * as commands }: Types and methods required for creating Enmity Commands.
 * @param {Dialog, Navigation}: Functions used to @arg {open a Dialog/Pop-up}, and @arg {open a custom Page.}
 * @param React: The main React implementation to do functions such as @arg React.useState or @arg React.useEffect
 * @param Toasts: Function to open a small notification at the top of your discord.
 * @param Storage: Allows you to store and retrive any item.
 * @param {name, plugin}: The name and information about the plugin from @arg manifest.json.
 * @param { Format.string, displayToast, Icons, Debug.fetchDebugArguments, mapItem }: Utility Functions that Dislate uses.
 * @param {bulk, filters}: Used to import modules in bulk
 * @param Info: The main "@arg debug" page to choose custom parameters to send the @arg Debug.debugInfo command
 * @param Page: The @arg base / @arg builder page used to render custom @arg Pages out. Contains a simple Close button, and requires additional @arg TSX to render more information.
 */
import {
  ApplicationCommandType,
  ApplicationCommandInputType,
  ApplicationCommandOptionType,
} from "enmity/api/commands";
import { Dialog, Navigation } from 'enmity/metro/common';
import { React, Toasts, Storage } from 'enmity/metro/common';
import { name, plugin } from '../../../manifest.json';
import { 
    Format, 
    Miscellaneous, 
    Icons, 
    ArrayImplementations as ArrayOps, 
    Debug, 
    Translate
} from '../../common';
import { bulk, filters } from "enmity/metro";
import Info from "../Pages/Debug/Info";
import Page from "../Pages/Page";
import { set } from "enmity/api/settings";
import LanguageNames from '../../translate/languages/names';
import ISO from '../../translate/languages/iso';

/** 
 * Main modules being fetched by the plugin to open links externally and copy text to clipboard
 * @param Router: This is used to open a url externally with @arg Router.openURL ~
 * @param Clipboard: This is used to copy any string to clipboard with @arg Clipboard.setString ~
 */
const [
    Clipboard,
] = bulk(
    filters.byProps('setString'),
);

/**
 * Returns an object of all available options. To add a new option, just write a new @arg key - @arg value pair with the callback as the value.
 * @param {string} channelId: The channel id provided by the context to @arg {send messages} and open the @arg Info page
 * @param {string} channelName: The channel name, used by other components to @arg {render in a toast}.
 * @returns {any}
 */
const options = (channelId: string, channelName: string): any => {
    return {
        /**
         * @param {any} debug: The main command that will get run to display important information such as the version of @param Dislate or the @param Discord build.
         */
        debug: async function() {
            /**
             * Get the full debug log asynchronously
             * @param {returns object} debugOptions: The full list of debug arguments.
             */
            const fullDebugLog = await Debug.debugInfo(
                Object.keys(await Debug.fetchDebugArguments()), 
                "full log"
            );

            return await new Promise(resolve => {
                /**
                 * Opens a dialog informing the user that they may customize the information sent with this command.
                 * 
                 * @uses @param {callback} Dialog: The main module to open @arg dialogs or @arg popups
                 */
                Dialog.show({
                    title: "Choose extra options",
                    body: "You can customize the information sent with this command. If you do not want to customize the debug log, press \"\`Ignore\`\" instead to send the full log.",
                    confirmText: "Customize",
                    cancelText: "Ignore",
                    onConfirm: () => {
                        /**
                         * @param wrapper: The main @arg Info page, wrapped as a function to add the channel id as a prop safely.
                         * @returns {Info TSX Page.}
                         */
                        const wrapper = (): any => <Info channelId={channelId} channelName={channelName} onConfirmCallback={(debugLog: string, type: string) => {
                            /**
                             * This closes the most top-level item in the Navigation stack. As the current @arg Info page is at the top, because this button is visible, This method will close the page.
                             * @param Navigation.pop: Removes the top item from the Navigation stack, closing the top level page.
                             */
                            Navigation.pop();

                            /**
                             * Opens a toast saying that a Log with the specific type has been sent to the channelName.
                             * @uses @param {string} type: The type of log that has been sent
                             * @uses @param {string} channelName: The name of the channel where the message has been sent.
                             */
                            Toasts.open({ 
                                content: `Sent ${type} log in #${channelName}.`, 
                                source: Icons.Settings.Toasts.Settings
                            })

                            resolve({
                                content: debugLog
                            })
                        }} />;
                        
                        /**
                         * Push the wrapped page to Navigation, hence opening new page.
                         * @arg {TSX} Page: The main default page
                         * @arg {TSX} wrapper: The wrapped Info component
                         * @uses @arg {string} name: The name of the Page, which will show up at the top.
                         */
                        Navigation.push(Page, { component: wrapper, name: `${name}: Customize`});
                    },
                    onCancel: () => {
                        /**
                         * Opens a toast saying that a Log with the specific type has been sent to the channelName.
                         * @uses @param {string} type: The type of log that has been sent
                         * @uses @param {string} channelName: The name of the channel where the message has been sent.
                         */
                        Toasts.open({ 
                            content: `Sent full log in #${channelName}.`, 
                            source: Icons.Settings.Toasts.Settings
                        })

                        resolve({
                            content: fullDebugLog
                        })
                    },
                })
            })
        },
        /**
         * @param {any} clearStores: Allows to user to clear all of their Dislate stores.
         */
         clearStores: async function() {
            /**
             * Fetch any existing stored state inside of the @arg dislateStoreState array.
             * @param storeItems: List of existing items in array form containing objects with name and type.
             */
            const storeItems: any = JSON.parse(await Storage.getItem("dislate_store_state")) ?? [];

            /**
             * Loop through the stored items with a custom implementation of a forEach to allow for labels.
             * @param {object} storeItems: List of items to clear the store of, which were explicitly set with the store_item.ts file.
             */
            ArrayOps.forItem(storeItems, async function(item: any) {
                /**
                 * Either removes the item or sets it to false depending on whether the item type is storage or not
                 * @if {(@arg item.type) is equal to @arg {string} storage} -> Remove the item's name from storage.
                 * @else {()} -> Set the item name to false as a setting.
                 */
                item.type==='storage'
                    ? await Storage.removeItem(item.name)
                    : set(name, item.name, false)
            }, 'clearing state store');

            /**
             * Remove the store to ensure it doesnt get cleared twice.
             */
            await Storage.removeItem('dislate_store_state');
            
            return await new Promise(async function(resolve) {
                /**
                 * Finally, open a @arg Toast to notify the user that all of the stores have been cleared.
                 */
                Toasts.open({ 
                    content: `Cleared all ${name} stores.`, 
                    source: Icons.Settings.Toasts.Settings 
                });

                resolve({});
            })
        },
        /**
         * @param {any} download: Allows the user to copy a unique download link of Dislate to the clipboard.
         */
        download: async function() {
            return await new Promise(resolve => {
                /**
                 * Set a new download link to clipboard every time the function is called, to prevent the plugin reinstalling with the same code, due to caching.
                 * @param {string} plugin.download: The raw GitHub link of the plugin to install from @arg manifest.json
                 */
                Clipboard.setString(`${plugin.download}?${Math.floor(Math.random() * 1001)}.js`);

                /**
                 * Opens a toast saying that the "@arg {download link}" has been copied to clipboard.
                 * 
                 * @func displayToast: Opens a toast with a specified string as the argument saying that it has been copied to clipboard.
                 * @returns {void}
                 */
                Miscellaneous.displayToast("download link", 'clipboard');
                resolve({})
            })
        },
        /**
         * @param {any} test: Tests by attempting to send a translated message
         */
        Example: async function() {
            const englishContent = "Example Message. Enmity is a state or feeling of active opposition or hostility.";
            const randomLanguageIndex = Math.floor(Math.random() * (LanguageNames.length));
            const randomLanguageName = LanguageNames[randomLanguageIndex];

            /**
             * First, translate the test message into a random language.
             * @param {Promise<string>} content: Translated text
             */
            const translatedContent = await Translate.string(
                englishContent,
                { 
                    fromLang: "detect", 
                    toLang: randomLanguageName,  
                },
                Object.assign({}, ...LanguageNames.map((k, i) => ({ [k]: ISO[i] })))
            );

            /**
             * Open a native Enmity Dialog to prompt the user and confirm that they actually want to send this message.
             */
            return await new Promise(resolve => {
                Dialog.show({
                    title: "Are you sure?",
                    body: `**This is a testing message.**\nYou are about to send the following:\n\n**English:** ${englishContent}\n\n**${Format.string(randomLanguageName)}:** ${translatedContent}\n\nAre you sure you want to send this? :3`,
                    confirmText: "Yep, send it!",
                    cancelText: "Nope, don't send it",
                    onConfirm: () => {                
                        /**
                         * Then, open a @arg Toast declaring that the test message has been sent into the context channel
                         * @uses @param {string} channelName: The name of the channel where the command was executed
                         * @uses @param {number} Icons.Translate: The icon from Discord that I have picked for Translating.
                         */
                        Toasts.open({ 
                            content: `Sent test message in #${channelName}.`, 
                            source: Icons.Translate
                        });

                        resolve({ content: `**[${name}] Test Message**\n\n**English:** ${englishContent}\n**${Format.string(randomLanguageName)}:** ${translatedContent}` })
                    },
                    onCancel: () => {
                        /**
                         * Instead, open a seperate @arg Toast declaring that the message has not been send and the request was voided.
                         * @uses @param {number} Icons.Cancel:  The icon from Discord picked for cancel of requests.
                         */
                        Toasts.open({ 
                            content: `Cancelled translated message request.`, 
                            source: Icons.Cancel
                        });

                        resolve({});
                    },
                })
            })
        }
    }
}

/**
 * @param {any[]} commandOptions: The list of command options set as a simple array instead of hardcoding all of the values.
 * 
 * @func ArrayOps.mapItem: Takes in an @arg array and returns a new value for each item in the @arg array, in a @arg {new array}.
 */
const commandOptions: any[] = ArrayOps.mapItem(
    Object.keys(options("8008135", "placeholder")), 
    (item: string) => {
        return {
            name: Format.string(item, true),
            displayName: Format.string(item, true),
            value: item
        }
    }, 
    "debug options formatted as a command format"
);

/**
 * Main command to send out debug information for @arg Dislate.
 * @param {string} name: The main name of the plugin in @arg manifest.json
 * 
 * @returns {void{}}
 */
export default {
    /**
     * @param {string?} id?: The ID of the command. This is required for identifying the command.
     */
    id: `${name?.toLowerCase()}`,

    /**
     * @param {string} name: The main name of the command
     * @param {string?} displayName?: The name of the commmand that would actually display in-app. For example: @arg {</dislate:1>}
     * 
     * These are set to be equal values.
     */
    name: `${name?.toLowerCase()}`,
    displayName: `${name?.toLowerCase()}`,

    /**
     * @param {string} description: The main description of the command
     * @param {string?} displayDescription?: The description of the commmand that would actually display in-app. For example: @arg {</dislate:1>}
     * 
     * These are also set to be equal values.
     */
    description: `Choose from a list of options for debugging in ${name}.`,
    displayDescription: `Choose from a list of options for debugging in ${name}.`,

    /**
     * @param {ApplicationCommandType} type: Determines that this is a Chat command.
     * @param {ApplicationCommandInputType} inputType: Determines the type of input that the commmand is expecting. In this case, it's a keyboard.
     */
    type: ApplicationCommandType.Chat,
    inputType: ApplicationCommandInputType.BuiltInText,

    /**
     * This command only uses a single option, that being the type of command to be executed, hence the @arg type option.
     * @param options: List of options that the command will take. Example: @arg {/dislate type:Debug}
     */
    options: [{
        /**
         * @param {name: string, displayName: string?}: The name of the option.
         * @param {description: string, displayDescription: string?}: The description of the option.
         * @param {ApplicationCommandOptionType} type: The kind of value expected by the command. In this case its an @arg string.
         * @param {object[]} choices: The list of choices that the option can take. In this case, it's a list of items calculated at the top level of the code.
         * @param {boolean} required: Whether the option is required for the command to run or not. As its mandatory to get which type was selected, this has been set to @arg true.
         */
        name: "type",
        displayName: "type",
        description: "The type of command to execute.",
        displayDescription: "The type of command to execute.",
        type: ApplicationCommandOptionType.String,
        choices: [...commandOptions],
        required: true,
    }],

    execute: async function (args, context) {
        /**
         * @param {string} commandType: The main option chosen by the user when they ran the command.
         */
        const commandType = ArrayOps.findItem(args, (o: any) => o.name == "type").value;

        /**
         * @param {string[]} availableOptions: The main "@arg hashMap" or @arg object of defined functions that the debug command will execute. If an argument is passed at the top level and isn't added here, a Toast will display showing an error.
         * @param throwToast: A fallback toast, used in case the function from the debug argumetns couldnt be found. As a result, this toast will appear instead.
                * @uses @param Icons.Clock: Clock icon imported from ./icons
         */
        const availableOptions = options(context.channel.id, context.channel.name);
        const throwToast = () => {
            Toasts.open({ content: 'Invalid command argument.', source: Icons.Clock });
        };

        /**
         * @param {callback ?? throwToast} chosenOption: Sets the command callback to either the callback from the @arg availableOptions function or uses the @arg throwToast as a fallback
         */
        const chosenOption = availableOptions[commandType] ?? throwToast;

        /**
         * Finally, call this @arg chosenOption function with no arguments, as none are needed.
         * Afterwards, return an empty object.
         */
        return await chosenOption();
    },
};