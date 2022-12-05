/** 
 * Imports
 * @param { * as commands }: Types and methods required for creating Enmity Commands.
 * @param {Dialog, Navigation}: Functions used to @arg {open a Dialog/Pop-up}, and @arg {open a custom Page.}
 * @param React: The main React implementation to do functions such as @arg React.useState or @arg React.useEffect
 * @param Toasts: Function to open a small notification at the top of your discord.
 * @param Storage: Allows you to store and retrive any item.
 * @param {name, plugin}: The name and information about the plugin from @arg manifest.json.
 * @param { format_string, toast, Icons, fetch_debug_arguments, map_item }: Utility Functions that Dislate uses.
 * @param {bulk, filters}: Used to import modules in bulk
 * @param Info: The main "@arg debug" page to choose custom parameters to send the @arg debug_info command
 * @param Page: The @arg base / @arg builder page used to render custom @arg Pages out. Contains a simple Close button, and requires additional @arg TSX to render more information.
 * @param send_debug_log: Allows you to send a debug log.
 */
import {
  Command,
  ApplicationCommandType,
  ApplicationCommandInputType,
  ApplicationCommandOptionType,
} from "enmity/api/commands";
import { Dialog, Navigation } from 'enmity/metro/common'
import { React, Toasts, Storage } from 'enmity/metro/common';
import { name, plugin } from '../../manifest.json';
import { format_string, toast, Icons, fetch_debug_arguments, map_item, send_debug_log, for_item, find_item } from '../utils'
import { bulk, filters } from "enmity/metro";
import Info from "./Info";
import Page from "./Page";
import { set } from "enmity/api/settings";

/** 
 * Main modules being fetched by the plugin to open links externally and copy text to clipboard
 * @param Router: This is used to open a url externally with @arg Router.openURL ~
 * @param Clipboard: This is used to copy any string to clipboard with @arg Clipboard.setString ~
 */
const [
    Router,
    Clipboard,
] = bulk(
    filters.byProps('transitionToGuild'),
    filters.byProps('setString'),
);

/**
 * Returns an object of all available options. To add a new option, just write a new @arg key - @arg value pair with the callback as the value.
 * @param {string} channel_id: The channel id provided by the context to @arg {send messages} and open the @arg Info page
 * @param {string} channel_name: The channel name, used by other components to @arg {render in a toast}.
 * @returns {any}
 */
const options = (channel_id: string, channel_name: string): any => {
    return {
        /**
         * @param {any} debug: The main command that will get run to display important information such as the version of @param Dislate or the @param Discord build.
         */
        debug: () => {
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
                onConfirm: async function() {
                    /**
                     * @param wrapper: The main @arg Info page, wrapped as a function to add the channel id as a prop safely.
                     * @returns {Info TSX Page.}
                     */
                    const wrapper = (): any => <Info channel_id={channel_id} channel_name={channel_name} />
                    
                    /**
                     * Push the wrapped page to Navigation, hence opening new page.
                     * @arg {TSX} Page: The main default page
                     * @arg {TSX} wrapper: The wrapped Info component
                     * @uses @arg {string} name: The name of the Page, which will show up at the top.
                     */
                    Navigation.push(Page, { component: wrapper, name: `${name}: Customize`})
                },
                onCancel: async function() {
                    /**
                     * Get the full list of available arguments asynchronously
                     * @param {returns object}debug_options: The full list of debug arguments.
                     */
                    const debug_options = await fetch_debug_arguments()
    
                    /**
                     * Send a debug log in the current channel with the full log as a parameter.
                     * @param channel_id: The ID of the current channel.
                     * @param channel_name: The name of the current channel.
                     */
                    await send_debug_log(
                        Object.keys(debug_options), 
                        {channel_id: channel_id, channel_name: channel_name}, 
                        'full', 
                        'full log in Info Command.'
                    )
                },
            })
        },
        /**
         * @param {any} clear_stores: Allows to user to clear all of their Dislate stores.
         */
         clear_stores: async function() {
            /**
             * Fetch any existing stored state inside of the @arg dislate_store_state array.
             * @param store_items: List of existing items in array form containing objects with name and type.
             */
            const store_items: any = JSON.parse(await Storage.getItem("dislate_store_state")) ?? []

            /**
             * Loop through the stored items with a custom implementation of a forEach to allow for labels.
             * @param {object} store_items: List of items to clear the store of, which were explicitly set with the store_item.ts file.
             */
            for_item(store_items, async function(item: any) {
                /**
                 * Either removes the item or sets it to false depending on whether the item type is storage or not
                 * @if {(@arg item.type) is equal to @arg {string} storage} -> Remove the item's name from storage.
                 * @else {()} -> Set the item name to false as a setting.
                 */
                item.type==='storage'
                    ? await Storage.removeItem(item.name)
                    : set(name, item.name, false)
            }, 'clearing state store')

            /**
             * Remove the store to ensure it doesnt get cleared twice.
             */
            await Storage.removeItem('dislate_store_state')

            /**
             * Finally, open a @arg Toast to notify the user that all of the stores have been cleared.
             */
            Toasts.open({ 
                content: `Cleared all ${name} stores.`, 
                source: Icons.Settings.Toasts.Settings 
            });
        },
        /**
         * @param {any} download: Allows the user to copy a unique download link of Dislate to the clipboard.
         */
        download: () => {
            /**
             * Set a new download link to clipboard every time the function is called, to prevent the plugin reinstalling with the same code, due to caching.
             * @param {string} plugin.download: The raw GitHub link of the plugin to install from @arg manifest.json
             */
            Clipboard.setString(`${plugin.download}?${Math.floor(Math.random() * 1001)}.js`);

            /**
             * Opens a toast saying that the "@arg {download link}" has been copied to clipboard.
             * 
             * @func clipboard_toast: Opens a toast with a specified string as the argument saying that it has been copied to clipboard.
             * @returns {void}
             */
            toast("download link", 'clipboard')
        }
    }
}

/**
 * @param {any[]} command_options: The list of command options set as a simple array instead of hardcoding all of the values.
 * 
 * @func map_item: Takes in an @arg array and returns a new value for each item in the @arg array, in a @arg {new array}.
 */
const command_options: any[] = map_item(
    Object.keys(options("8008135", "placebo")), 
    (item: string) => {
        return {
            name: format_string(item),
            displayName: format_string(item),
            value: item
        }
    }, 
    "debug options formatted as a command format"
)

/**
 * Main command to send out debug information for @arg Dislate.
 * @param {string} name: The main name of the plugin in @arg manifest.json
 * 
 * @returns {void{}}
 */
const debug_command: Command = {
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
        choices: [...command_options],
        required: true,
    },],

    execute: async function (args, context) {
        /**
         * @param {string} command_type: The main option chosen by the user when they ran the command.
         */
        const command_type = find_item(args, (o: any) => o.name == "type").value;

        /**
         * @param {string[]} available_options: The main "@arg hash_map" or @arg object of defined functions that the debug command will execute. If an argument is passed at the top level and isn't added here, a Toast will display showing an error.
         * @param throw_toast: A fallback toast, used in case the function from the debug argumetns couldnt be found. As a result, this toast will appear instead.
                * @uses @param Icons.Debug_Command.Clock: Clock icon imported from ./icons
         */
        const available_options = options(context.channel.id, context.channel.name)
        const throw_toast = () => {
            Toasts.open({ content: 'Invalid command argument.', source: Icons.Debug_Command.Clock });
        }

        /**
         * @param {callback ?? throw_toast} chosen_option: Sets the command callback to either the callback from the @arg available_options function or uses the @arg throw_toast as a fallback
         */
        const chosen_option =  available_options[command_type] ?? throw_toast

        /**
         * Finally, call this @arg chosen_option function with no arguments, as none are needed.
         * Afterwards, return an empty object.
         */
        chosen_option()
        return {};
    },
};

export { debug_command };