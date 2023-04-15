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
import { Format, Icons, Translate } from "../../common";

const languageOptions = LanguageNames.filter((e: string) => e !== 'Detect')
  .map((item: string) => ({
    name: Format.string(item),
    displayName: Format.string(item),
    value: item
  }))

export default {
  id: "translate",
  name: "translate",
  displayName: "translate",
  description: `Send a message using ${name} in any language chosen, using the Google Translate API.`,
  displayDescription: `Send a message using ${name} in any language chosen, using the Google Translate API.`,
  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltInText,
  options: [
    {
      name: "text",
      displayName: "text",
      description: `The text/message for ${name} to translate. Please note some formatting of mentions and emojis may break due to the API.`,
      displayDescription: `The text/message for ${name} to translate. Please note some formatting of mentions and emojis may break due to the API.`,
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: "language",
      displayName: "language",
      description: `The language that ${name} will translate the text into. This can be any language from the list, except "Detect".`,
      displayDescription: `The language that ${name} will translate the text into. This can be any language from the list, except "Detect".`,
      type: ApplicationCommandOptionType.String,
      choices: [...languageOptions],
      required: true
    },
  ],

  async execute(args, context) {
    const message = args.find((o: any) => o.name === "text").value;
    const language = args.find((o: any) => o.name === "language").value;
    const languageMap = Object.assign({}, ...LanguageNames.map((k, i) => ({ [k]: ISO[i] })));

    const apiKeyRegExp = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}?:fx/
    const apiKey = get("Dislate-DeepL", "deeplApiKey") as string;
    if (!apiKey || !apiKeyRegExp.test(apiKey)) {
       Toasts.open({
          content:'Invalid API Key',
          source:Icons.Failed
       });
       return;
    }

    const translatedContent = await Translate.string(
      message,
      {
        fromLanguage: get(name, "DislateLangFrom", "Detect") as string,
        toLanguage: language,
      },
      languageMap
    );

    const translatedBack = await Translate.string(
      translatedContent, 
      {
        fromLanguage: get(name, "DislateLangFrom", "Detect") as string,
        toLanguage: get(name, "DislateLangTo", 'English') as string,
      },
      languageMap
    );

    if (!translatedContent || !translatedBack) {
      sendReply(context.channel.id, `Failed to send message in #${context.channel.name}`);
      return {};
    };

    return await new Promise((resolve): void => {
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
        body: `The message **about to be sent** is:\n\`${translatedContent}\`\n\nIn **${Format.string(get(name, "DislateLangTo", 'English') as string)}**, this will translate to:\n\`${translatedBack}\`\n\n${get(name, "DislateBothLangToggle", false) ? `**Note: Sending original and translated**\n` : ''}Are you sure you want to send this? :3`,
        confirmText: "Yep, send it!",
        cancelText: "Nope, don't send it",
        onConfirm: () => {
          Toasts.open({ 
            content: `Sent message in #${context.channel.name}, which was translated into ${Format.string(language)}.`, 
            source: Icons.Translate
          });

          resolve({ content: get(name, "DislateBothLangToggle", false) ? `${message}\n\n${translatedContent}` : translatedContent });
        },
        onCancel: () => {
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
