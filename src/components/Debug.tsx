// main imports used later
import {
  Command,
  ApplicationCommandType,
  ApplicationCommandInputType,
  ApplicationCommandOptionType
} from "enmity/api/commands";
import { Dialog, Messages, Navigation } from 'enmity/metro/common'
import { React, Toasts } from 'enmity/metro/common';
import {name, version, release, plugin} from '../../manifest.json';
import { debug_info, format_string, clipboard_toast, Icons, fetch_debug_arguments } from '../utils'
import { bulk, filters } from "enmity/metro";
import Info from "./Info";
import Page from "./Page";

// main declaration of modules being altered by the plugin
const [
    Router, // used to open a url externally
    Clipboard, // used to copy the dl link to keyboard
] = bulk(
    filters.byProps('transitionToGuild'),
    filters.byProps('setString'),
);

let nameAsLowercase = name.toLowerCase() // "dislate" instead of "Dislate"
const debugCommand: Command = {
  // default command imports
  id: `${nameAsLowercase}`,

  name: `${nameAsLowercase}`,
  displayName: `${nameAsLowercase}`,

  description: `Choose from a list of options for debugging in ${name}`,
  displayDescription: `Choose from a list of options for debugging in ${name}`,

  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltInText,

  options: [{ // the debug to console option
    name: "type",
    displayName: "type",
    description: "The type of command to execute",
    displayDescription: "The type of command to execute",
    type: ApplicationCommandOptionType.String,
    choices: [
        {
            name: format_string("debug"),
            displayName: format_string("debug"),
            value: "debug"
        },
        {
            name: format_string("download"),
            displayName: format_string("download"),
            value: "download"
        },
        {
            name: format_string("repo"),
            displayName: format_string("repo"),
            value: "repo"
        }
    ],
    required: true, // required
  },],

  execute: async function (args, context) {
    let commandType = args.find((o) => o.name == "type").value; // main command type

    // object of all options and their corresponding functions
    const options = {
        debug: async function() {
            Dialog.show({
                title: "Choose extra options",
                body: "You can customize the information sent with this command. If you dont want to customize the debug log, press \"\`Ignore and send\`\" instead to send the full log.",
                confirmText: "Customize",
                cancelText: "Ignore",
                onConfirm: () => {
                    // sends useful debug info as a message
                    const wrapper = () => {
                        return <Info channel_id={context.channel.id} />
                    }
                    Navigation.push(Page, { component: wrapper, name: "Dislate: Choose Information"}) // opens custom page with languages
                },
                onCancel: async function() {
                    const debug_options = await fetch_debug_arguments()
                    Messages.sendMessage(context.channel.id, {
                        content: await debug_info(Object.keys(debug_options))
                    }); // send a message with string interpolation

                    // opens a toast to declare success
                    Toasts.open({ 
                        // formats the string and shows language that it has changed it to
                        content: `Sent debug info in current channel.`, 
                        source: Icons.Debug_Command.Sent
                    })                    
                },
            })
        },
        download: () => { // sets the plugin download link to clipboard
            Clipboard.setString(`${plugin.download}?${Math.floor(Math.random() * 1001)}.js`);
            clipboard_toast("download link")
        },
        repo: () => { // opens the repo of the plugin externally
            Router.openURL(plugin.repo)
        }
    }

    const throwToast = () => {
        Toasts.open({ content: 'Invalid command argument.', source: Icons.Debug_Command.Clock });
    } // toast to show error (this should never be called in theory.)

    // attempts to choose the correct option and falls back to a toast if the option is undefined
    const chosenOption = options[commandType] ?? throwToast
    chosenOption() // calls the function
            
        
    return {}; // return empty
  },
};

export { debugCommand };