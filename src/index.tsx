/** 
 * Imports
 * @param FormRow: The main component which will be @arg patched into the LazyActionSheet module
 * @param { Plugin, registerPlugin }: These are used to register an Enmity plugin, and @arg Plugin in particular is also used as a type.
 * @param { bulk, filters, getByProps }: These are used to fetch modules from the Discord API.
 * @param React: This is used to run proprietary functions such as @arg React.useState or @arg React.useEffect
 * @param Toasts: This is a function used to open an @arg toast, which is a little notification at the top of your screen.
 * @param create: This is used to create the @arg Patcher.
 * @param manifest: This is the main @arg manifest.json which is required for displaying the @arg Plugin.
 * @param {get, getBoolean}: This allows you to get data from the Enmity Settings store. @arg Setting data is not required in this file, and as a result hasn't been imported.
 * @param TranslateCommand: The main command to send a translated message. Trigger: @arg {/translate text:{string} language:{option}} 
 * @param DebugCommand: The main command to debug @arg Dislate. Trigger: @arg {/dislate type:{option}}
 * @param Settings: The main settings page.
 * @param LanguageNames: The key pair list of languages and their abbreviated forms.
 */
import { FormRow } from 'enmity/components';
import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import { bulk, filters, getByName, getByProps } from 'enmity/metro'
import { Native, NavigationNative, React, Toasts } from 'enmity/metro/common';
import { create } from 'enmity/patcher';
import manifest from '../manifest.json';
import { get, getBoolean } from 'enmity/api/settings';
import { findInReactTree } from 'enmity/utilities';
import { 
   Translate,
   Format, 
   Miscellaneous, 
   ArrayImplementations,
   Icons
} from './common';
import { DebugCommand, Settings, TranslateCommand } from './components/';
import LanguageNamesArray from './translate/languages/names';
import ISO from './translate/languages/iso'

/**  
 * Top Level Bulk-Filter Variable Declaration --
 * @param {any} LazyActionSheet: The main ActionSheet which I would patch into
 * @param {any} ChannelStore: Allows you to get the current channel
 * @param {any} Icon: Component used for icons in action sheets
*/
const [
   ChannelStore,
   Icon,
   LazyActionSheet
] = bulk(
   filters.byProps("getChannel", "getDMFromUserId"),
   filters.byName("Icon"),
   filters.byProps("openLazy", "hideActionSheet"),
);

/**
 * Modules which are fetched dynamically --
 * @param {(constant)any} MessageStore: The main store used to fetch messages and get OOP content from them like content and id.
 * @param {(constant)any} FluxDispatcher: The main dispatcher of message edit and delete events, this is used later to edit messages client side with the translated content.
 */
const MessageStore = getByProps("getMessage", "getMessages");
const FluxDispatcher = getByProps(
   "_currentDispatchActionType",
   "_subscriptions",
   "_actionHandlers",
   "_waitQueue"
);
const ActionSheetFor170 = getByName("ActionSheet", { default: false });
const ActionSheetFor164 = getByProps("EmojiRow");

/** 
 * Top Level Global Variables --
 * @param {any} Patcher: The main patcher which is used for Instead, Before, and After patches of Modules
 * @param {any} LanguageNames: The main list of language names paired with their ISO 2-digit-character code.
 */
const Patcher = create(manifest.name);
const LanguageNames = Object.assign({}, ...LanguageNamesArray.map((k, i) => ({ [k]: ISO[i] })));

/** 
 * Top Level Cache Variables --
 * @param {object} cachedData: The main object which holds cached data. This data persists for only each instance of Enmity, so if you restart the app it will clear. It stores this data so that it can detect if a message has been translated yet and change the button (based on {buttonType}) to Revert.
 */
let cachedData: object[] = [{"invalid_id": "rosie sucks"}];

/**
 * @param ActionSheetInformation: The interface to determine the properties that the ActionSheet patcher will take
 */
interface ActionSheetInformation {
   unpatch: () => void;
   data: {
      message: { [key: string]: any }
      res: any 
   }
}

/**
 * A custom Dislate plugin type to allow for extra functions on the object.
 */
type DislatePlugin = Plugin & { 
   patchActionSheet: (info: ActionSheetInformation) => void;
   initializeActionSheet: () => void;
   renderPage: (navigation: any, { pageName, pagePanel }: { pageName: string, pagePanel: any }) => any;
}

/** 
 * Main Dislate Plugin Source --
 * @param {Plugin} Dislate: The main plugin constructor, rolled up later into a build
 */
const Dislate: DislatePlugin = {
   /**
    * Spreads (creates a copy of) {manifest}, imported in the Top-Level --
    * @param {object} manifest: The main manifest used in the Plugin, containing important information.
    * @param {Array} commands: The array of commands that the plugin will export. Starts off empty
    */
   ...manifest,
   commands: [],

   patchActionSheet({ unpatch, data: { message, res } }: ActionSheetInformation) {
      unpatch();
                  
      /**
       * Uses globally scoped variables
       * @param {string} TranslateType: The main state of whether the button is in the @param {string} Translate or @param {string} Revert state.
       * @param {number} ButtonOffset: This starts off at @arg {0} and increases by @arg {1} for each time a FormRow with an @arg {external} key is found. This would be then added on to the index of where to place the button. This deals with issues of @arg interfering plugins.
       */
      let translateType: string = "Translate"
      let buttonOffset: number = 0;

      /**
       * Checks if @param {object} res has a "props" property as its required for the rest of the code to function
       * @if {(@param {(nullable)unknown} res.props) is falsey} -> Return early and log an error to console.
       * @param {string} manifest.name: The name of the plugin in manifest. This would be Dislate in this case.
       */
      if (!res?.props) {
         console.log(`[${manifest.name} Local Error: Property "props" Does not Exist on "res"]`);
         return res;
      }

      /**
       * This would be classified as the final location of the actionSheet. This is an array of all the ButtonRow items (and any FormRow items from other plugins)
       * @param {any[]} finalLocation: The final location of items that Dislate modifies later.
       */
      // let finalLocation = res?.props?.children?.props?.children?.props?.children[1];
      const finalLocation = findInReactTree(res, r => 
         Array.isArray(r)
         && r.find(o => typeof o?.key === "string"
            && typeof o?.props?.message === "string")
      )

      /**
       * Checks if @param {object} finalLocation exists as its required to prevent a crash
       * @if {(@param {(nullable)unknown} finalLocation) is falsey} -> Return early and log an error to console.
       * @param {string} manifest.name: The name of the plugin in manifest. This would be Dislate in this case.
       */
      if (!finalLocation) {
         console.log(`[${manifest.name} Local Error: 'finalLocation' seems to be undefined!]`);
         return res;
      }

      /**
       * Check whether any external plugins are installed through the keys of them which were fetched earlier.
       * @function forItem: Loops through a list with a callback as the second argument. Custom implementation of forEach, imported from ./common/index.ts
            * @arg {Array}: The array which the function would loop through.import language from '../modified/translate/src/languages/index';jdoiwahoaiwh
            * @arg {callback}: This would run on each iteration of the loop.
            * @arg {string} label: The label of what the function is looping. This is used for logging incase of an error and should always be provided, but is not required.
         */
      ArrayImplementations.forItem(Object.values(Miscellaneous.externalPlugins), (index: number) => {
         /**
          * Checks if it can find an index in this list which isn't the one used for Dislate.
          * @if {(@function findItem) is not falsey} -> Increment @param {number} ButtonOffset
          *
          * @function findItem: Tries to find a specified item in a list
               * @arg {Array} finalLocation: The array to check
               * @arg {string} label: The label of what the function is searching for. This is used for logging incase of an error and should always be provided, but is not required.
            * @returns {any || undefined}: an item which was found or undefined if it didn't find anything
            */
         if (ArrayImplementations.findItem(finalLocation, (item: any) => {
            /**
             * Requires that any items which match are not the key used for Dislate.
             * @if ((@param {string} item.key) is not (@param {string} externalPlugins.dislate)) -> Filter it to only ones which aren't Dislate's key
             * @returns {any} keys which don't equal the one used in Dislate but match the keys used in other plugins.
            */
            if (item.key !== Miscellaneous.externalPlugins.dislate) {
               return item.key === index;
            }
         }, 'external plugin list')) {
            buttonOffset++;
         }
      }, "looping through external plugin keys");
      /**
       * Check if a Reply and Edit Message button exists, and increment the counter based on which are @param {boolean} true.
       * @if {(@function findItem) is not falsey} -> Increment @param {number} ButtonOffset
       *
       * @function findItem: Searches for whether there's a Reply or Edit Message Button.
            * @param {Array} finalLocation: The final location array of the plugin
            * @param {callback}: Checks if the item's props's message is identical to the one used in Reply or Edit Message, meaning that its a valid button.
                  * @param {string} item.props.message: The label/message of the Button.
            * @arg {string} label: The label of what the function is looping. This is used for logging incase of an error and should always be provided, but is not required.
         */
      if (ArrayImplementations.findItem(finalLocation, (item: any) => item.props?.message === "Reply", 'reply button')) {
         buttonOffset++;
      }

      if (ArrayImplementations.findItem(finalLocation, (item: any) => item.props?.message === "Edit Message", 'edit message button')) {
         buttonOffset++;
      }

      /**
       * Fetch the proprietary original message from the MessageStore
       * @param {object} originalMessage: The original message with properties such as @arg content or @arg id
       *
       * @function MessageStore.getMessage: Fetches a message based on its Message ID and Channel ID.
            * @param {string} message[0].message.channel_id: The Channel ID of the message being fetched
            * @param {string} message[0].message.id: The Proprietary ID of the message being fetched
         * @returns {object}: Object of data from the original message on the server side.
         */
      const originalMessage = MessageStore.getMessage(
         message[0]?.message?.channel_id,
         message[0]?.message?.id
      );

      /**
       * Return early if it cannot find any content in either of the original message nor the actual message, meaning its likely an embed or attachment with no content.
       * @if {(@param {string} originalMessage.content is falsey) <AND> (@param {string} message[0].message.content is falsey)} -> Return early as the message has no translateable content.
       */
      if (!originalMessage?.content && !message[0]?.message?.content) {
         console.log(`[${manifest.name}] No message content.`);
         return res;
      }

      /**
       * Gets useful data in this specific lexical scope
       * @param {string} messageId: The ID of the message which will be modified.
       * @param {string} messageContent: The content of the message, which will be translated later.
       * @param {object || undefined} existingCachedObject: Finds a cached object from the message cache. Can be @arg undefined.
       *
       * @function findItem: Searches for whether there's an existing message in the cache.
            * @arg {Array<object>} cachedData: The object of cached data
            * @arg {callback}: Checks if the Message ID is in the cache. If it is, that means it has been cached already and the state needs to be ~Revert~
                  * @param {string} messageId: The proprietary ID of the message, which would be stored in cache later.
            * @arg {string} label: The label of what the function is looping. This is used for logging incase of an error and should always be provided, but is not required.
         */
      const messageId = originalMessage?.id ?? message[0]?.message?.id;
      const messageContent = originalMessage?.content ?? message[0]?.message?.content;
      const existingCachedObject = ArrayImplementations.findItem(cachedData, (o: any) => Object.keys(o)[0] === messageId, 'cache object');

      /**
       * Set the Translate type to whichever is needed based on whether any object in the cache was found, using a ternary operator.
       * @param {object || undefined} existingCachedObject: Finds a cached object from the message cache. Can be @arg undefined.
       * @param {string} translateType: Has 2 States ~ @arg Translate, and @arg Revert.
       *
       */
      translateType = existingCachedObject ? "Revert" : "Translate"

      const mainElement = <FormRow
         /**
          * This is a TSX/JSX Element, and uses props in this way.
          * @param {string} key: This is used to prevent duplicate rendering of the button. Set with @arg externalPlugins.dislate.
          * @param {string} label: The label of the button. This is the text that will actually appear on as the button's Text. Shows Translate or Revert depending on whether the current type is @arg buttonType.Translate or not.
          * @param {icon} leading: The icon that will display before the button's text.
          * @param {function} onPress: The event fired when the button is pressed.
          */
         key={Miscellaneous.externalPlugins.dislate}
         label={translateType}
         leading={<Icon 
            source={translateType === "Translate"
               ? Icons.Translate
               : Icons.Revert}
         />}
         onPress={() => {
            /**
             * @param {string} translateType: The current translate type based on the cache from earlier.
             * @param {(constant)boolean} fromLanguage: The language to translate to.
             * @param {(constant)boolean} toLanguage: The language to translate to
             * @param {(constant)boolean} isTranslated: As this check is used quite often, storing it in a variable is useful.
             */
            const fromLanguage = get(manifest.name, "DislateLangFrom", "detect") as string;
            const toLanguage = get(manifest.name, "DislateLangTo", "english") as string;
            const isTranslated = translateType === "Translate";

            /**
             * Translates a string and reverts it back based on if it exists or not.
             * @function Translate.string: Translates a string
                  * @arg {string} originalMessage.content: The content of the message
                  * @arg {string} fromLanguage: The language to translate from.
                  * @arg {string} toLanguage: The language to translate to.
                  * @arg {boolean} isTranslated: If this is true, it just straight up returns the content without translating it. It's a hacky fix, but it saves a lot of code repetition.
               */
            Translate.string(
               originalMessage.content,
               {
                  fromLang: fromLanguage,
                  toLang: toLanguage,
               },
               LanguageNames,
               !isTranslated
            ).then(res => {
               /**
                * Edit the message in the correct context
                * @param {object} editEvent: The main edit event which will be fired by @arg FluxDispatcher.
                     * @arg {string} type: The type of update, by default this is @param {string} MESSAGE_UPDATE.
                     * @arg {object} message: The main message with all attributes.
                           * @arg {string} content: The content of the message.
                           * @arg {string} guild_id: The server ID of the message.
                     * @arg {boolean} log_edit: Whether it should log this edit event to Debug Logs.
                  *
               */
               const editEvent = {
                  type: "MESSAGE_UPDATE",
                  message: {
                     ...originalMessage,
                     content: `${
                        isTranslated 
                           ? res 
                           : (existingCachedObject as object)[messageId]} ${
                        isTranslated 
                           ? `\`[${getBoolean(manifest.name, "DislateLangAbbr", false) 
                              ? (LanguageNames[toLanguage]).toUpperCase() 
                              : Format.string(toLanguage)}]\`` 
                           : ""}`,
                     guild_id: ChannelStore.getChannel(
                        originalMessage.channel_id
                     ).guild_id,
                  },
                  log_edit: false
               };

               /**
                * @function FluxDispatcher.dispatch: Fires an event to FluxDispatcher.
                     * @arg {object} editEvent
                  */
               FluxDispatcher.dispatch(editEvent);

               /**
                * Open a toast to declare whether the string was translated or reverted.
                * @param {string} content: The content of the toast.
                * @param {unknown} source: The source icon of the toast.
                *
                * @function Format.string: Adds a capital letter to the start of the string and replaces underscores with spaces
                     * @arg {string}: The string to format.
                  * @returns {string}
                  *
                  * @function get: Gets a value from the Enmity Settings API.
                     * @arg {string} file: The file/name of the Plugin. In this case its @param {string} manifest.name, which is Dislate.
                     * @arg {string} key: The key of the Setting.
                     * @arg {string || undefined} default: The default/fallback value. This is optional.
                  * @returns {any}
                  */
               Toasts.open({
                  content: isTranslated
                     ? `Modified message to ${Format.string(get(manifest.name, "DislateLangTo", "english") as string)}.`
                     : `Reverted message back to original state.`,
                  source: Icons.Translate
               });

               /**
                * Either adds or removes the object from cache depending if it has been translated already.
                * @if {(@param {boolean} isTranslated is not false)} -> Add the new object to @param {(mutable)Array<object>} cachedData.
                * @else {()} -> Filter @param {object} cachedData and set it to itself
                */
               isTranslated
                  ? cachedData.unshift({ [messageId]: messageContent })
                  : cachedData = ArrayImplementations.filterItem(cachedData, (e: any) => e !== existingCachedObject, 'cached data override');
            });

            /**
             * Hides the ActionSheet
             * @function LazyActionSheet.hideActionSheet: Hides an action sheet.
             */
            LazyActionSheet.hideActionSheet();
         } } />;

      /**
       * Inserts the React item to the list of items in the array
       */
      ArrayImplementations.insertItem(finalLocation, mainElement, buttonOffset, "insert translate button");
   },

   initializeActionSheet() {
      /**
       * Attempts to patch the ActionSheet --
       * @param {(mutable)number} attempt: The current attempt that the Patcher is on, the default is 0 obviously
       * @param {(constant)number} maxAttempts: The maximum amount of attempts before giving up. This is set to 3.
       */
      let attempt = 0;
      const maxAttempts = 3;

      try {
         /**
          * Increases the count of attempts;
          * @param {(mutable)number} attempt
          */
         attempt++;

         /**
          * Option in settings to check whether the user has enabled init toasts.
          * @param {boolean} enableToasts: Whether the user has checked "initialisation toasts" in Plugin Settings.
          */
         let enableToasts = getBoolean(manifest.name, "toastEnable", false);

         /**
          * Attempts to wake up FluxDispatcher in case it is sleeping.
          * @throws if theres an error when waking up @arg FluxDispatcher
          * @returns {void}
          */
         for (const handler of ["MESSAGE_UPDATE"]) {
            try {
               FluxDispatcher?.dispatch({
                  type: handler,
                  message: {},
               });
            } catch (err) { 
               console.error(`[${manifest.name} Local Error When Waking Up FluxDispatcher ${err}]`); 
            }
         }

         /**
          * Simple log in the console showing the current attempt and max attempts
          * @param {string} manifest.name: The name of the plugin. In this case, its "Dislate"
          * @param {number} attempt: The current attempt.
          * @param {number} maxAttempts: The maximum amount of attempts
          *
          ** Also uses a ternary operator to check if it should open a toast.
          * @param {boolean} enableToasts: The state of initialisation toasts in settings.
          */
         console.log(`[${manifest.name}] delayed start attempt ${attempt}/${maxAttempts}.`);

         enableToasts
            ? Toasts?.open({
               content: `[${manifest.name}] start attempt ${attempt}/${maxAttempts}.`,
               source: Icons.Debug,
            })
            : null;

         /**
          * The main patching of the ActionSheet. This is in a try/catch incase there are any unprepared errors, although it still crashes Enmity sometimes if there are.
          */
         try {
            /**
            * @param {string} Version: The version of Discord, example is @170.0
            */
            const { Version } = Native.InfoDictionaryManager;

            /**
             * Only uses this ActionSheetKey patch if the version is above @164, so @170 or something.
             */
            if (parseInt(Version.substring(0, 3)) > 164) {
               return Patcher.after(ActionSheetFor170, "default", (_, __, res) => {
                  /**
                   * @param FinalLocation: The endpoint to find the @type and the @sheetKey of the ActionSheet
                   */
                  const FinalLocation = res?.props?.children?.props;
   
                  /**
                   * Returns early if the @sheetKey is not "MessageLongPressActionSheet", meaning this is not a Message ActionSheet
                   */
                  if (FinalLocation?.sheetKey !== "MessageLongPressActionSheet") return;
   
                  /**
                   * Afterwards, Patches the @type of @FinalLocation with the data provided and passes it to a different function to avoid repetition
                   */
                  const unpatch = Patcher.after(FinalLocation?.content, "type", (_, message, res) => {
                     if (!message || !res) return;

                     this.patchActionSheet({
                        unpatch,
                        data: {
                           message,
                           res
                        }
                     })
                  }) 
               })
            }

            /**
             * Otherwise, uses the old method to patch which works for @164 to patch @default and still passes it to a different function
             */
            return Patcher.after(ActionSheetFor164, "default", (_, message, res) => { 
               if (!message || !res) return;

               this.patchActionSheet({
                  unpatch: () => {},
                  data: {
                     message,
                     res
                  }
               })
            });
         } catch (err) {
            console.error(`[${manifest.name}] Local ${err} At Intermediate Level`);
            /**
             * Opens an error as a Toast
             * @if {(@param {boolean} enableToasts is true)} -> Open a toast declaring an error.
                  * @param {string} manifest.name: The name of the plugin.
             * @else {()} -> null
             */
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

            /**
             * Opens an error as a Toast declaring that it is trying again in an amount of secords.
             * @if ((@param {boolean} enableToasts is true)) -> Open a toast declaring an error.
                  * @param {string} manifest.name: The name of the plugin.
             * @else () -> null
             */
            enableToasts
               ? Toasts.open({
                  content: warningMessage,
                  source: Icons.Retry,
               })
               : null;

            /**
             * Waits an amount of time before trying again recursively
             * @function patchActionSheet: The current function.
             * @param {number} attempt: The current attempt.
             */
            setTimeout(this.initializeActionSheet(), attempt * 10000);
         } else {
            const errorMessage = `[${manifest.name}] failed to initialise. Giving up.`;
            console.error(errorMessage);

            /**
             * Opens an error as a Toast declaring giving up on Initialising Dislate.
             * @if ((@param {boolean} enableToasts is true)) -> Open a toast declaring an error.
                  * @param {string} manifest.name: The name of the plugin.
             * @else () -> null
             */
            enableToasts
               ? Toasts.open({
                  content: errorMessage,
                  source: Icons.Failed,
               })
               : null;
         }
      }
   },

   onStart() {
      /**
       * Sets/Concatenates the commands used in the plugin to @param this.commands --
       * @param {Command} translateCommand: The main command of </translate:1> which allows you to send translated messages with the following format:
            * @param {string} text: The text you want to translate.
            * @param {string[]} language: The language you want to translate to (array).
       * @param {Command} debugCommand: The main debug info command of </dislate:1> which allows you to do the following
            * @param {string} Debug: Send a customizable Debug Information message.
            * @param {string} Download: Get a download link of Dislate copied to clipboard.
            * @param {string} Repo: Open the repo of Dislate externally.
       */
      this.commands = [
         DebugCommand,
         TranslateCommand
      ];
      this.initializeActionSheet();
   },

   onStop() {
      /**
       * Unpatches everything
       * @param {Command[]} this.commands
       * @param {Patch[]} this.patches
       *
       * @function Patcher.unpatchAll: Unpatches everything.
       */
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
      /**
       * Opens a settings panel
       * @param {TSX} Settings: React Native Page.
       */
      return <Settings settings={settings} manifest={{
         name: manifest.name, 
         version: manifest.version, 
         plugin: manifest.plugin, 
         authors: manifest.authors, 
         release: manifest.release}
      } renderPage={Dislate.renderPage} languages={LanguageNames} />
   }
};

registerPlugin(Dislate);