// main imports used later
import {
  Command,
  ApplicationCommandType,
  ApplicationCommandInputType,
  ApplicationCommandOptionType
} from "enmity/api/commands";
import { Messages } from 'enmity/metro/common'
import { React, Toasts } from 'enmity/metro/common';
import {name, version, release, plugin} from '../../manifest.json';
import { debugInfo, formatString, clipboard_toast, Icons } from '../utils'
import { bulk, filters } from "enmity/metro";

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
            name: formatString("debug"),
            displayName: formatString("debug"),
            value: "debug"
        },
        {
            name: formatString("download"),
            displayName: formatString("download"),
            value: "download"
        },
        {
            name: formatString("repo"),
            displayName: formatString("repo"),
            value: "repo"
        }
    ],
    required: true, // required
  },],

  execute: async function (args, context) {
    let commandType = args.find((o) => o.name == "type").value; // main command type

    // object of all options and their corresponding functions
    const options = {
        debug: () => { // sends useful debug info as a message
            Messages.sendMessage(context.channel.id, {
                content: debugInfo(version, release)
            }); // send a message with string interpolation
            
            // opens a toast to declare that message has been sent
            Toasts.open({ 
                // formats the string and shows language that it has changed it to
                content: `Sent debug info in current channel.`, 
                source: Icons.Debug_Command.Sent
            })
        },
        download: () => { // sets the plugin download link to clipboard
            Clipboard.setString(`${plugin[0].download}?${Math.floor(Math.random() * 1001)}.js`);
            clipboard_toast("download link")
        },
        repo: () => { // opens the repo of the plugin externally
            Router.openURL(plugin[0].repo)
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