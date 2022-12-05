/** Imports
 * @param sendReply: Allows you to get an empheral reply fom Clyde.
 * @param { * as commands }: Types and methods required for creating Enmity Commands.
 * @param get: Allows you to retrieve a setting from the plugin file.
 * @param { Dialog, Messages }: Functions used to @arg {open a Dialog/Pop-up}, and @arg {send a Message as the user}.
 * @param React: The main React implementation to do functions such as @arg React.useState or @arg React.useEffect
 * @param Toasts: Function to open a small notification at the top of your discord.
 * @param { name }: The name from the plugin from @arg manifest.json.
 * @param { find_item, format_string, Icons, map_item, translate_string, filter_item }: Utility Functions that Dislate uses.
 * @param { bulk, filters }: Used to import modules in bulk
 * @param Info: The main "@arg debug" page to choose custom parameters to send the @arg debug_info command
 * @param Page: The @arg base / @arg builder page used to render custom @arg Pages out. Contains a simple Close button, and requires additional @arg TSX to render more information.
 * @param send_debug_log: Allows you to send a debug log.
 */
import { sendReply } from "enmity/api/clyde";
import {
  ApplicationCommandInputType,
  ApplicationCommandOptionType, ApplicationCommandType, Command
} from "enmity/api/commands";
import { get } from 'enmity/api/settings';
import { React, Dialog, Messages, Toasts } from 'enmity/metro/common';
import { name } from '../../manifest.json';
import lang_names from '../../modified/translate/src/languages/names';
import { find_item, format_string, Icons, map_item, translate_string, filter_item } from "../utils";

/**
 * Creates a new array with the options of languages in a form which is required to render options in Enmity commands.
 * This also removes the "Detect" option as it's the language to translate **to**, and you cannot translate to Detect.
 * 
 * @param {any[]} lang_options: The list of available languages in a format which can be used to create Enmity command options.
 */
const lang_options: any[] = map_item(
  filter_item(Object.keys(lang_names), (e: string) => e!=='detect', 'filter for everything except for detect'), 
  (item: string) => ({
      name: format_string(item),
      displayName: format_string(item),
      value: item
  }), 
  "language names"
)

/**
 * Main Translate Command.
 * 
 * @arg Features: 
    * Allows you to send a message in the current channel with any language (supported by the API).
    * Opens a confirmation dialog before sending the command to ensure that you are sending the correct message. 
 */
const translate_command: Command = {
  /**
   * @param {string?} id?: The id of the command to be identifiable.
   */
  id: "translate",

  /**
   * The name of the command, used to trigger it.
   * @param {string} name: The name of the command.
   * @param {string?} displayName?: The display name of the command.
   */
  name: "translate",
  displayName: "translate",
  
  /**
   * The description of the command, used to descibe what the command does
   * @param {string} description: The description of the command
   * @param {string?} displayDescription?: The display description of the command
   */
  description: `Send a message using ${name} in any language chosen, using the Google Translate API.`,
  displayDescription: `Send a message using ${name} in any language chosen, using the Google Translate API.`,

  /**
   * @param {ApplicationCommandType} type: The type of command, in this case it's a @arg Chat command.
   * @param {ApplicationCommandInputType} inputType: The type of input for the command parameters, which is @arg {built in text}.
   */
  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltInText,

  /**
   * @param {object[]} options: The parameters that the command will take.
   */
  options: [
    {
      /**
       * The main text parameter of the command. This is the text that the user will input, which will be translated with the Translate API.
       */
      /**
       * @param {string} name: The name of the parameter, in this case its @arg {"text"}
       * @param {string?} displayName?: The display name of the parameter, in this case its @arg {"text"}
       */
      name: "text",
      displayName: "text",
      /**
       * @param {string} description: The description of the command. This will display under the command's name, as a sub-label.
       * @param {string?} displayDescription?: The display description of the command. This will display under the command's name, as a sub-label.
       */
      description: `The text/message for ${name} to translate. Please note some formatting of mentions and emojis may break due to the API.`,
      displayDescription: `The text/message for ${name} to translate. Please note some formatting of mentions and emojis may break due to the API.`,
      /**
       * @param {ApplicationCommandOptionType} type: The @arg {primitive} type of the parameter. In this case it's a String as it is translating text.
       * @param {boolean} required: This is set to true because there needs to be content to translate.
       */
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      /**
       * The main language parameter of the command. This is the language that the text will translate into, using the Translate API.
       */
      /**
       * @param {string} name: The name of the parameter, in this case its @arg {"language"}
       * @param {string?} displayName?: The display name of the parameter, in this case its @arg {"language"}
       */
      name: "language",
      displayName: "language",
      /**
       * @param {string} description: The description of the command. This will display under the command's name, as a sub-label.
       * @param {string?} displayDescription?: The display description of the command. This will display under the command's name, as a sub-label.
       */
      description: `The language that ${name} will translate the text into. This can be any language from the list, except "Detect".`,
      displayDescription: `The language that ${name} will translate the text into. This can be any language from the list, except "Detect".`,
      /**
       * @param {ApplicationCommandOptionType} type: The @arg {primitive} type of the parameter. In this case it's a String as it is translating text.
       * @param {object[]} choices: The list of options that a user must conform to when running the command.
       * @param {boolean} required: This is set to true because there needs to be a language to translate to.
       */
      type: ApplicationCommandOptionType.String,
      choices: [
        ...lang_options
      ],
      required: true
    },
  ],

  execute: async function (args, context) {
    /**
     * Uses a custom find implementation which is very similar to @arg Array.prototype.find but has ability to pass labels.
     * @param {string} message: The content of the message to translate.
     * @param {string} language: The language to translate the message into.
     */
    const message = find_item(args, (o: any) => o.name == "text", 'translate text').value;
    const language = find_item(args, (o: any) => o.name == "language", 'translate language').value;
    
    /**
     * First, translate the original message into the language provided, using the language to @arg {translate from}, from the @arg Dislate settings.
     * @param {Promise<string>} translated_content: awaits a translation into the language provided from the message content.
     * 
     * @uses @param {string} message: The message to translate.
     * @uses @param {string} language: The language to translate into.
     */
    const translated_content = await translate_string(
      message,
      {
        fromLang: get(name, "DislateLangFrom", "detect"),
        toLang: language
      }
    )

    /**
     * Next, translate the content which was returned from the other translate callback into the language that the user chose in Settings.
     * This is done so that you can see what the message would look like when translated back into your preferred language, as translators are not always accurate.
     * 
     * @uses @param {Promise<string>} translated_back: Translated the message back using the Translate API, and the language from settings.
     * @uses @param {string} translated_content: The old content which was translated using the parameters provided from the command.
     */
    const translated_back = await translate_string(
      translated_content, 
      {
        fromLang: get(name, "DislateLangFrom", "detect"),
        toLang: get(name, "DislateLangTo", 'english')
      }
    )
    
    /**
     * Returns early if either of the calls are undefined.
     * @if {(@arg translated_content or @arg translated_back are undefined)} -> Return early and display a Clyde message saying that the message failed to translate.
     */
    if (!translated_content || !translated_back) {
      sendReply(context.channel.id, `Failed to send message in #${context.channel.name}`);
      return {};
    }

    /**
     * Open a native Enmity Dialog to prompt the user and confirm that they actually want to send this message.
     */
    Dialog.show({
      title: "Are you sure?",
      /**
       * @param {string} body: The main content of the Dialog. This is a formatted version of it:
       * 
       * @arg {
       * The message **about to be sent** is:
       * \`${translated_content}\`
       * 
       * In **${preferred_language}**, this will translate to:
       * \`${translated_back}\`
       * 
       * [OPTIONAL if user chose to send both translated and original:
       * **Note: Sending original and translated**]
       * Are you sure you want to send this?
       * }
       */
      body: `The message **about to be sent** is:\n\`${translated_content}\`\n\nIn **${format_string(get(name, "DislateLangTo", 'english'))}**, this will translate to:\n\`${translated_back}\`\n\n${get(name, "DislateBothLangToggle", false) ? `**Note: Sending original and translated**\n` : ''}Are you sure you want to send this?`,
      confirmText: "Yeah, send it",
      cancelText: "Nope, don't send it",
      onConfirm: () => {
        /**
         * Send the message into the channel where the command was executed, and use the @arg translated_content as the body of the message.
         * @uses @param {string?} message?: The original text message that the user wrote.
         * @uses @param {string} translated_content: The main content of the message, from the text and language provided as parameters to the command.
         */
        Messages.sendMessage(context.channel.id, {
          content: get(name, "DislateBothLangToggle", false) ? `${message}\n\n${translated_content}` : translated_content
        });

        /**
         * Then, open a @arg Toast declaring that the message has been sent into the context channel and the language that it was sent as.
         * @uses @param {string} context.channel.name: The name of the channel where the command was executed
         * @uses @param {string} language: The language that the user provided when running the command.
         * @uses @param {string_id} Icons.Translate: The icon from Discord that I have picked for Translating.
         */
        Toasts.open({ 
          content: `Sent message in #${context.channel.name}, which was translated into ${format_string(language)}.`, 
          source: Icons.Translate
        })
      },
      onCancel: () => {
        /**
         * Instead, open a seperate @arg Toast declaring that the message has not been send and the request was voided.
         * @uses @param {string_id} Icons.Cancel:  The icon from Discord picked for cancel of requests.
         */
        Toasts.open({ 
          content: `Cancelled translated message request.`, 
          source: Icons.Cancel
        })
      },
    })
    
    /** 
     * Lastly, return an empty object.
     * @returns {object}
     */
    return {};
  },
};

export { translate_command };
