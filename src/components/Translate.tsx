// main imports used later
import { sendReply } from "enmity/api/clyde";
import {
  Command,
  ApplicationCommandType,
  ApplicationCommandInputType,
  ApplicationCommandOptionType,
} from "enmity/api/commands";
import { translateString , formatString } from "../utils";
import { get } from 'enmity/api/settings';
import { React, Toasts, Dialog } from 'enmity/metro/common';
import { getIDByName } from 'enmity/api/assets';
import langNames from 'translate/src/languages/names'
import { Messages } from 'enmity/metro/common'

// converts the key:value pair of languages into a format readable by the command
let langOptions: any[] = Object.keys(langNames).map(item => {
  return {
    name: formatString(item),
    displayName: formatString(item),
    value: item
  }
})

const translateCommand: Command = {
  // default command imports
  id: "translate",

  name: "translate",
  displayName: "translate",

  description: "Send a message in the language chosen.",
  displayDescription: "Send a message in the language chosen.",

  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltInText,

  options: [
    { // the text which will be used as an argument later
      name: "text",
      displayName: "text",
      description: "Text to send translated",
      displayDescription: "Text to send translated",
      type: ApplicationCommandOptionType.String,
      required: true, // required
    },
    {
      // the language which it will translate to
      name: "language",
      displayName: "language",
      description: "Language that it will translate to.",
      displayDescription:
        "The Language that Dislate will translate into.",
      type: ApplicationCommandOptionType.String,
      choices: [
        ...langOptions.filter(e => e.name!=="Detect") // spreads the array into this one (copies it)
      ],
      required: true, // also required
    },
  ],

  execute: async function (args, context) {
    let message = args.find((o) => o.name == "text").value; // main message content
    let language = args.find((o) => o.name == "language").value; // main language
    
    translateString( // main function based on utils/index.tsx
      message, // the valid content from the command arg sent
      get("Dislate", "DislateLangFrom", "detect"), // the language to translate from, default is detect/automatic
      language // the language to translate to, an argument
    ).then(res => { // what to do after the message gets returned from the translate function (async)
      if (!res) {
        sendReply(context.channel.id, "Failed to send Translated Message.");
        return {};
      } // if it doesnt return a valid string then return early

      Dialog.show({
        title: "Are you sure?",
        body: `The message about to be sent is:
\`${res}\`
Are you sure you want to send this?`,
        confirmText: "Yeah, send it",
        cancelText: "Nope, don't send it",
        onConfirm: () => {
          // send the message in the channel which the command was executed in
          Messages.sendMessage(context.channel.id, {
            content: res // the translated content
          });

          // opens a toast to declare that message has been sent
          Toasts.open({ 
            // formats the string and shows language that it has changed it to
            content: `Sent message in ${formatString(language)}.`, 
            source: getIDByName('img_nitro_star')
          })
        },
        onCancel: () => {
          // opens a toast to declare success
          Toasts.open({ 
            // formats the string and shows language that it has changed it to
            content: `Cancelled translated message request.`, 
            source: getIDByName('ic_megaphone_nsfw_16px')
          })
        },
      })
      
      return {};
    })
  },
};

export { translateCommand };