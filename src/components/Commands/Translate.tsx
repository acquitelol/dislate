/** Imports
 * @param sendReply: Allows you to get an empheral reply fom Clyde.
 * @param { * as commands }: Types and methods required for creating Enmity Commands.
 * @param get: Allows you to retrieve a setting from the plugin file.
 * @param { Dialog, Messages }: Functions used to @arg {open a Dialog/Pop-up}, and @arg {send a Message as the user}.
 * @param React: The main React implementation to do functions such as @arg React.useState or @arg React.useEffect
 * @param Toasts: Function to open a small notification at the top of your discord.
 * @param { name }: The name from the plugin from @arg manifest.json.
 * @param { ArrayOps.findItem, Format.string, Icons, ArrayOps.mapItem, Translate.string, ArrayOps.filterItem }: Utility Functions that Dislate uses.
 * @param Info: The main "@arg debug" page to choose custom parameters to send the @arg debugInfo command
 * @param Page: The @arg base / @arg builder page used to render custom @arg Pages out. Contains a simple Close button, and requires additional @arg TSX to render more information.
 */
import { sendReply } from "enmity/api/clyde";
import {
  ApplicationCommandInputType,
  ApplicationCommandOptionType, 
  ApplicationCommandType
} from "enmity/api/commands";
import { get } from 'enmity/api/settings';
import { React, Dialog, Toasts } from 'enmity/metro/common';
import { name } from '../../../manifest.json';
import LanguageNames from '../../translate/languages/names';
import ISO from "../../translate/languages/iso";
import { ArrayImplementations as ArrayOps, Format, Icons, Translate } from "../../common";

/**
 * Creates a new array with the options of languages in a form which is required to render options in Enmity commands.
 * This also removes the "Detect" option as it's the language to translate **to**, and you cannot translate to Detect.
 * 
 * @param {any[]} languageOptions: The list of available languages in a format which can be used to create Enmity command options.
 */
const languageOptions: any[] = ArrayOps.mapItem(
  ArrayOps.filterItem(LanguageNames, (e: string) => e!=='detect', 'filter for everything except for detect'), 
  (item: string) => ({
      name: Format.string(item),
      displayName: Format.string(item),
      value: item
  }), 
  "language names"
);

/**
 * Main Translate Command.
 * 
 * @arg Features: 
    * Allows you to send a message in the current channel with any language (supported by the API).
    * Opens a confirmation dialog before sending the command to ensure that you are sending the correct message. 
 */
export default {
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
   * @param {ApplicationCommandType} type: The type of command, in this case it's an @arg Chat command.
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
      choices: [...languageOptions],
      required: true
    },
  ],

  execute: async function (args, context) {
    /**
     * Uses a custom find implementation which is very similar to @arg Array.prototype.find but has ability to pass labels.
     * @param {string} message: The content of the message to translate.
     * @param {string} language: The language to translate the message into.
     */
    const message = ArrayOps.findItem(args, (o: any) => o.name == "text", 'translate text').value;
    const language = ArrayOps.findItem(args, (o: any) => o.name == "language", 'translate language').value;
    const languageMap = Object.assign({}, ...LanguageNames.map((k, i) => ({ [k]: ISO[i] })));

    /**
     * First, translate the original message into the language provided, using the language to @arg {translate from}, from the @arg Dislate settings.
     * @param {Promise<string>} translatedContent: awaits a translation into the language provided from the message content.
     * 
     * @uses @param {string} message: The message to translate.
     * @uses @param {string} language: The language to translate into.
     */
    const translatedContent = await Translate.string(
      message,
      {
        fromLang: get(name, "DislateLangFrom", "detect") as string,
        toLang: language,
      },
      languageMap
    );

    /**
     * Next, translate the content which was returned from the other translate callback into the language that the user chose in Settings.
     * This is done so that you can see what the message would look like when translated back into your preferred language, as translators are not always accurate.
     * 
     * @uses @param {Promise<string>} translatedBack: Translated the message back using the Translate API, and the language from settings.
     * @uses @param {string} translatedContent: The old content which was translated using the parameters provided from the command.
     */
    const translatedBack = await Translate.string(
      translatedContent, 
      {
        fromLang: get(name, "DislateLangFrom", "detect") as string,
        toLang: get(name, "DislateLangTo", 'english') as string,
      },
      languageMap
    );
    
    /**
     * Returns early if either of the calls are undefined.
     * @if {(@arg translatedContent or @arg translatedBack are undefined)} -> Return early and display a Clyde message saying that the message failed to translate.
     */
    if (!translatedContent || !translatedBack) {
      sendReply(context.channel.id, `Failed to send message in #${context.channel.name}`);
      return {};
    };

    
    /** 
     * Lastly, return an empty object if cancelled or the translated content if confirmed.
     * @returns {object}
     */
    return await new Promise((resolve): void => {
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
         * \`${translatedContent}\`
         * 
         * In **${preferredLanguage}**, this will translate to:
         * \`${translatedBack}\`
         * 
         * [OPTIONAL if user chose to send both translated and original:
         * **Note: Sending original and translated**]
         * Are you sure you want to send this?
         * }
         */
        body: `The message **about to be sent** is:\n\`${translatedContent}\`\n\nIn **${Format.string(get(name, "DislateLangTo", 'english') as string)}**, this will translate to:\n\`${translatedBack}\`\n\n${get(name, "DislateBothLangToggle", false) ? `**Note: Sending original and translated**\n` : ''}Are you sure you want to send this? :3`,
        confirmText: "Yep, send it!",
        cancelText: "Nope, don't send it",
        onConfirm: () => {
          /**
           * Then, open an @arg Toast declaring that the message has been sent into the context channel and the language that it was sent as.
           * @uses @param {string} context.channel.name: The name of the channel where the command was executed
           * @uses @param {string} language: The language that the user provided when running the command.
           * @uses @param {number} Icons.Translate: The icon from Discord that I have picked for Translating.
           */
          Toasts.open({ 
            content: `Sent message in #${context.channel.name}, which was translated into ${Format.string(language)}.`, 
            source: Icons.Translate
          });

          resolve({ content: get(name, "DislateBothLangToggle", false) ? `${message}\n\n${translatedContent}` : translatedContent });
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

          resolve({})
        },
      })
    })
  },
};
