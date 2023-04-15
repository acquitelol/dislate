import { FormRow } from 'enmity/components';
import { registerPlugin } from 'enmity/managers/plugins';
import { bulk, filters, getByName, getByProps } from 'enmity/metro'
import { React, Toasts } from 'enmity/metro/common';
import { create } from 'enmity/patcher';
import manifest from '../manifest.json';
import { get, getBoolean } from 'enmity/api/settings';
import { findInReactTree } from 'enmity/utilities';
import { 
   Translate,
   Format, 
   Miscellaneous,
   Icons
} from './common';
import { DebugCommand, Settings, TranslateCommand } from './components/';
import LanguageNamesArray from './translate/languages/names';
import ISO from './translate/languages/iso'
import { version } from 'enmity/api/native';
import { ActionSheetInformation, DislatePlugin } from './def';

const [
   ChannelStore,
   Icon,
   LazyActionSheet,
   I18N,
   ActionSheetFor170,
   ActionSheetFor164,
   FluxDispatcher
] = bulk(
   filters.byProps("getChannel", "getDMFromUserId"),
   filters.byName("Icon"),
   filters.byProps("openLazy", "hideActionSheet"),
   filters.byProps("Messages"),
   filters.byName("ActionSheet", false),
   filters.byProps("EmojiRow"),
   filters.byProps("_currentDispatchActionType", "_subscriptions", "_actionHandlers", "_waitQueue")
);

const Patcher = create(manifest.name);
const LanguageNames = Object.assign({}, ...LanguageNamesArray.map((k, i) => ({ [k]: ISO[i] })));
let cachedData: object[] = [{"invalid_id": "rosie sucks"}];

const Dislate: DislatePlugin = {
   ...manifest,
   commands: [],

   patchActionSheet({ data: { message, res } }: ActionSheetInformation) {
      let translateType: string = "Translate"
      let buttonOffset: number = 0;

      if (!res?.props) {
         console.log(`[${manifest.name} Local Error: Property "props" Does not Exist on "res"]`);
         return;
      }

      const finalLocation = findInReactTree(res, r => 
         Array.isArray(r)
         && r.find(o => typeof o?.key === "string"
         && typeof o?.props?.message === "string")
      )

      if (!finalLocation) {
         console.log(`[${manifest.name} Local Error: 'finalLocation' seems to be undefined!]`);
         return;
      }

      Object.values(Miscellaneous.externalPlugins).forEach((index) => {
         if (finalLocation.find((item: any) => {
            if (item.key !== Miscellaneous.externalPlugins.dislate) {
               return item.key === index;
            }
         }))
         
         buttonOffset++;
      })

      for (const item of [
         finalLocation.find((item: any) => item.props?.message === I18N.Messages.MESSAGE_ACTION_REPLY),
         finalLocation.find((item: any) => item.props?.message === I18N.Messages.EDIT_MESSAGE)
      ]) {
         if (item) buttonOffset++;
      }

      if (!message?.content) {
         console.log(`[${manifest.name}] No message content.`);
         return;
      }

      const messageId = message?.id;
      const messageContent = message?.content;
      const existingCachedObject = cachedData.find((o: any) => Object.keys(o)[0] === messageId, 'cache object');

      translateType = existingCachedObject ? "Revert" : "Translate"

      const mainElement = <FormRow
         key={Miscellaneous.externalPlugins.dislate}
         label={translateType}
         leading={<Icon 
            source={translateType === "Translate"
               ? Icons.Translate
               : Icons.Revert}
         />}
         onPress={() => {
            const apiKeyRegExp = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}?:fx/
            const apiKey = get("Dislate-DeepL", "deeplApiKey") as string;
            if (!apiKey || !apiKeyRegExp.test(apiKey)) {
               LazyActionSheet.hideActionSheet();
               Toasts.open({
                  content:'Invalid API Key',
                  source:Icons.Failed
               });
               return;
            }
            const fromLanguage = get(manifest.name, "DislateLangFrom", "Detect") as string;
            const toLanguage = get(manifest.name, "DislateLangTo", "English") as string;
            const isTranslated = translateType === "Translate";

            Translate.string(
               message.content,
               {
                  fromLanguage: fromLanguage,
                  toLanguage: toLanguage,
               },
               LanguageNames,
               !isTranslated
            ).then(res => {
               const editEvent = {
                  type: "MESSAGE_UPDATE",
                  message: {
                     ...message,
                     content: `${
                        isTranslated 
                           ? res 
                           : (existingCachedObject as object)[messageId]} ${
                        isTranslated 
                           ? `\`[${getBoolean(manifest.name, "DislateLangAbbr", false) 
                              ? (LanguageNames[toLanguage]).toUpperCase() 
                              : Format.string(toLanguage)}]\`` 
                           : ""}`,
                     guild_id: ChannelStore.getChannel(message.channel_id).guild_id,
                  },
                  log_edit: false
               };

               FluxDispatcher.dispatch(editEvent);

               Toasts.open({
                  content: isTranslated
                     ? `Modified message to ${Format.string(get(manifest.name, "DislateLangTo", "English") as string)}.`
                     : `Reverted message back to original state.`,
                  source: Icons.Translate
               });

               isTranslated
                  ? cachedData.unshift({ [messageId]: messageContent })
                  : cachedData = cachedData.filter((e: any) => e !== existingCachedObject, 'cached data override');
            });

            LazyActionSheet.hideActionSheet();
         }} 
      />;

      finalLocation.splice(buttonOffset, 0, mainElement);
   },

   onStart() {
      this.commands = [
         DebugCommand,
         TranslateCommand
      ];

      let attempt = 0;
      const maxAttempts = 3;

      try {
         attempt++;
         let enableToasts = getBoolean(manifest.name, "toastEnable", false);
         try {
            FluxDispatcher?.dispatch({
               type: "MESSAGE_UPDATE",
               message: {},
            });
         } catch (err) { 
            console.error(`[${manifest.name} Local Error When Waking Up FluxDispatcher ${err}]`); 
         }

         console.log(`[${manifest.name}] delayed start attempt ${attempt}/${maxAttempts}.`);

         if (enableToasts) Toasts?.open({
            content: `[${manifest.name}] start attempt ${attempt}/${maxAttempts}.`,
            source: Icons.Debug,
         })

         try {
            if (parseInt(version.substring(0, 3)) > 164) {
               typeof ActionSheetFor170.default === 'function' && 
                  Patcher.after(ActionSheetFor170, "default", (_, __, res) => {
                     const FinalLocation = findInReactTree(res, r => r.sheetKey)
                     if (FinalLocation?.sheetKey && FinalLocation.sheetKey !== "MessageLongPressActionSheet") return;

                     Patcher.after(FinalLocation?.content, "type", (_, [{ message }], res) => {
                        this.patchActionSheet({ data: { message, res } })
                     }) 
                  })
            } else {
               typeof ActionSheetFor164.default === 'function' && 
                  Patcher.after(ActionSheetFor164, "default", (_, [{ message }], res) => { 
                     this.patchActionSheet({ data: { message, res } })
                  });
            }
         } catch (err) {
            console.error(`[${manifest.name}] Local ${err} At Intermediate Level`);

            enableToasts
               ? Toasts.open({
                  content: `[${manifest.name}] failed to open action sheet.`,
                  source: Icons.Retry,
               })
               : null;
         }
      } catch (err) {
         console.error(`[${manifest.name}] Local ${err} At Top Level`);
         let enableToasts = getBoolean(manifest.name, "toastEnable", false);

         if (attempt < maxAttempts) {
            const warningMessage = `[${manifest.name}] failed to initialise. Trying again in ${attempt}0s.`;
            console.warn(warningMessage);

            if (enableToasts) Toasts.open({
               content: warningMessage,
               source: Icons.Retry,
            })

            setTimeout(this.initializeActionSheet(), attempt * 10000);
         } else {
            const errorMessage = `[${manifest.name}] failed to initialise. Giving up.`;
            console.error(errorMessage);

            if (enableToasts) Toasts.open({
               content: errorMessage,
               source: Icons.Failed,
            })
         }
      }
   },

   onStop() {
      Patcher.unpatchAll();
      this.commands = [];
   },

   renderPage(navigation, { pageName, pagePanel }) {
      return navigation?.push?.("EnmityCustomPage", {
         pageName,
         pagePanel
      })
   },

   getSettingsPanel({ settings }) {
      return <Settings 
         settings={settings} 
         manifest={manifest}
         renderPage={Dislate.renderPage} 
         languages={LanguageNames} 
      />
   }
};

registerPlugin(Dislate);