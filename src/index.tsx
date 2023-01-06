/** 
 * Imports
 * @param FormRow: The main component which will be @arg patched into the LazyActionSheet module
 * @param { Plugin, registerPlugin }: These are used to register an Enmity plugin, and @arg Plugin in particular is also used as a type.
 * @param { bulk, filters, getByProps }: These are used to fetch modules from the Discord API.
 * @param React: This is used to run proprietary functions such as @arg React.useState or @arg React.useEffect
 * @param Toasts: This is a function used to open a @arg toast, which is a little notification at the top of your screen.
 * @param create: This is used to create the @arg Patcher.
 * @param manifest: This is the main @arg manifest.json which is required for displaying the @arg Plugin.
 * @param {get, getBoolean}: This allows you to get data from the Enmity Settings store. @arg Setting data is not required in this file, and as a result hasn't been imported.
 * @param TranslateCommand: The main command to send a translated message. Trigger: @arg {/translate text:{string} language:{option}} 
 * @param TebugCommand: The main command to debug @arg Dislate. Trigger: @arg {/dislate type:{option}}
 * @param Settings: The main settings page.
 * @param LanguageNames: The key pair list of languages and their abbreviated forms.
 */
import { FormRow } from 'enmity/components';
import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import { bulk, filters, getByProps } from 'enmity/metro'
import { React, Toasts } from 'enmity/metro/common';
import { create } from 'enmity/patcher';
import manifest from '../manifest.json';
import { get, getBoolean } from 'enmity/api/settings';
import { 
   Translate,
   Format, 
   Miscellaneous, 
   ArrayImplementations,
   Icons, 
   Devices
} from './utils';
import { DebugCommand, TranslateCommand, Settings } from './components/';
import LanguageNames from '../modified/translate/src/languages/names';

/**  
 * Top Level Bulk-Filter Variable Declaration --
 * @param {any} LazyActionSheet: The main ActionSheet which I would patch into
 * @param {any} ChannelStore: Allows you to get the current channel
 * @param {any} Icon: Component used for icons in action sheets
*/
const [
   LazyActionSheet,
   ChannelStore,
   Icon
] = bulk(
   filters.byProps("openLazy", "hideActionSheet"),
   filters.byProps("getChannel", "getDMFromUserId"),
   filters.byName("Icon")
);

/** 
 * Top Level Global Variables --
 * @param {any} Patcher: The main patcher which is used for Instead, Before, and After patches of Modules
 * @param {enum} buttonType: This enumerator is used almost like a {Boolean}, in the sense that it toggles between {buttonType.Translate} and {buttonType.Revert}
 */
const Patcher = create('dislate');
enum buttonType {
   Translate,
   Revert
};

/** 
 * Top Level Cache Variables --
 * @param {object} cachedData: The main object which holds cached data. This data persists for only each instance of Enmity, so if you restart the app it will clear. It stores this data so that it can detect if a message has been translated yet and change the button (based on {buttonType}) to Revert.
 */
let cachedData: object[] = [{"invalid_id": "acquite sucks"}];

/** 
 * Main Dislate Plugin Source --
 * @param {Plugin} Dislate: The main plugin constructor, rolled up later into a build
 */
const Dislate: Plugin = {
   /**
    * Spreads (creates a copy of) {manifest}, imported in the Top-Level --
    * @param {object} manifest: The main manifest used in the Plugin, containing important information.
    * @param {Array} commands: The array of commands that the plugin will export. Starts off empty
    * @param {Array} patches: The array of patches that the plugin will export. Starts off empty
    */
   ...manifest,
   commands: [],
   patches: [],

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

      /**
       * Attempts to patch the ActionSheet --
       * @param {(mutable)number} attempt: The current attempt that the Patcher is on, the default is 0 obviously
       * @param {(constant)number} maxAttempts: The maximum amount of attempts before giving up. This is set to 3.
       */
      let attempt = 0;
      const maxAttempts = 3;

      /**
       * Main Patcher function to attempt and patch into the ActionSheet --
       * @function patchActionSheet: Tries to patch Dislate based on @var maxAttempts;
       * @returns {void}, as nothing is required to be returned
       */
      async function patchActionSheet(): Promise<void> {
         try {
            /**
             * Increases the count of attempts;
             * @param {(mutable)number} attempt
             */
            attempt++;

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

            /**
             * Option in settings to check whether the user has enabled init toasts.
             * @param {boolean} enableToasts: Whether the user has checked "initialisation toasts" in Plugin Settings.
             */
            let enableToasts = getBoolean(manifest.name, "toastEnable", false);

            /**
             * Runs a simple check to see if a device is compatible for Dislate to be used.
             * @function isCompatibleDevice: Opens a dialog if incompatible
             * @returns {void}
             */
            await Devices.isCompatibleDevice();

            /**
             * Attempts to wake up FluxDispatcher in case it is sleeping.
             * @throws if theres an error when waking up @var FluxDispatcher
             * @returns {void}
             */
            for (const handler of ["MESSAGE_UPDATE"]) {
               try {
                  FluxDispatcher?.dispatch({
                     type: handler,
                     message: {},
                  });
               } catch (err) { console.log(`[${manifest.name} Local Error When Waking Up FluxDispatcher ${err}]`); }
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
             * The main patching of the ActionSheet. This is in a try/catch incase there are any unprepared errors, although it still crashes Enmity if there are.
             * @param {any} LazyActionSheet: The main module being patched
             * @param {string} openLazy: The function being patched by the function in the form of a string (for some reason)
             * @param {callback}: The main callback of what the Patcher is meant to do with this function
             */
            try {
               Patcher.before(LazyActionSheet, "openLazy", (_, [component, sheet], _res) => {
                  /**
                   * Checks if the sheet is speficically "MessageLongPressActionSheet"
                   * @if {(@param {string} sheet) is identical to (@param {string} MessageLongPressActionSheet)} -> Only executes the patch if this condition is met.
                   */
                  if (sheet === "MessageLongPressActionSheet") {
                     component.then((instance) => {
                        /**
                         * Patching into the "before" state of the ActionSheet's instance
                          * @param {any} instance: The instance of the ActionSheet
                          * @param {string} default: The default function of the ActionSheet
                          * @param {callback}: The things that the Patcher is meant to do to patch the @param {string} default function
                          */
                        Patcher.after(instance, "default", (_, message, res) => {
                           /**
                            * Uses a React UseState Hook to toggle between the Translate and Revert state and re-render the component based on it.
                            * @param {[Setter, Getter]} TranslateType: The main state of whether the button is in the @param {enum} Translate or @param {enum} Revert state.
                            * @param {[Setter, Getter]} ButtonOffset: This starts off at 0 and increases by 1 for each time a FormRow with an external key is found. This would be then added on to the index of where to place the button. This deals with issues of interfering plugins.
                            *
                            * @param {enum} buttonType.Translate: The default value of @param {[Setter, Getter]} TranslateType, as an @arg enum.
                            * @param {enum} buttonType: The main enum for toggling the state, used as a @arg Generic type.
                            * @param {number}: The @arg Generic type used for @param {[Setter, Getter]} ButtonOffset, with @param {number} 0 as the default.
                            */
                           const [translateType, setTranslateType] = React.useState<buttonType>(buttonType.Translate);
                           const [buttonOffset, setButtonOffset] = React.useState<number>(0);

                           /**
                            * Checks if @param {object} res has a "props" property as its required for the rest of the code to function
                            * @if {(@param {(nullable)unknown} res.props) is falsey} -> Return early and log an error to console.
                            * @param {string} manifest.name: The name of the plugin in manifest. This would be Dislate in this case.
                            */
                           if (!res?.props) {
                              console.log(`[${manifest.name} Local Error: Property "Props" Does not Exist on "res"]`);
                              return res;
                           }

                           /**
                            * This would be classified as the final location of the actionSheet. This is an array of all the ButtonRow items (and any FormRow items from other plugins)
                            * @param {any[]} finalLocation: The final location of items that Dislate modifies later.
                            */
                           let finalLocation = res?.props?.children?.props?.children?.props?.children[1];

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
                            * Uses a single useEffect hook this render to check whether any external plugins are installed through the keys of them which were fetched earlier.
                            * @function forItem: Loops through a list with a callback as the second argument. Custom implementation of forEach, imported from ./utils/index.ts
                                 * @arg {Array}: The array which the function would loop through.
                                 * @arg {callback}: This would run on each iteration of the loop.
                                 * @arg {string} label: The label of what the function is looping. This is used for logging incase of an error and should always be provided, but is not required.
                            */
                           React.useEffect(() => {
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
                                 }, 'external plugin list'))
                                    setButtonOffset((previous: number) => previous + 1);
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
                                 setButtonOffset((previous: number) => previous + 1);
                              }

                              if (ArrayImplementations.findItem(finalLocation, (item: any) => item.props?.message === "Edit Message", 'edit message button')) {
                                 setButtonOffset((previous: number) => previous + 1);
                              }
                           }, []);

                           /**
                            * Fetch the proprietary original message from the MessageStore
                            * @param {object} originalOessage: The original message with properties such as @arg content or @arg id
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
                            * Set the Button's enum type to whichever is needed based on whether any object in the cache was found, using a ternary operator. Uses the setter as the dependency array so its a single call.
                            * @param {object || undefined} existingCachedObject: Finds a cached object from the message cache. Can be @arg undefined.
                            * @param {enum} buttonType: Has 2 States ~ @arg Translate, and @arg Revert.
                            *
                            * @function React.useEffect: Takes a callback and runs this callback everytime the value(s) in the dependency array change(s).
                                 * @arg {callback}: The callback to run.
                                 * @arg {any[]}: The dependency array.
                            */
                           React.useEffect(() => {
                              setTranslateType(existingCachedObject
                                 ? buttonType.Revert
                                 : buttonType.Translate
                              );
                           }, setTranslateType);

                           const mainElement = <FormRow
                              /**
                               * This is a TSX/JSX Element, and uses props in this way.
                               * @param {string} key: This is used to prevent duplicate rendering of the button. Set with @arg externalPlugins.dislate.
                               * @param {string} label: The label of the button. This is the text that will actually appear on as the button's Text. Shows Translate or Revert depending on whether the current type is @arg buttonType.Translate or not.
                               * @param {icon} leading: The icon that will display before the button's text.
                               * @param {function} onPress: The event fired when the button is pressed.
                               */
                              key={Miscellaneous.externalPlugins.dislate}
                              label={`${translateType === buttonType.Translate ? "Translate" : "Revert"}`}
                              leading={<Icon source={translateType === buttonType.Translate
                                 ? Icons.Translate
                                 : Icons.Revert} />}
                              onPress={() => {
                                 try {
                                    /**
                                     * @param {enum} translateType: The current translate type based on the cache from earlier.
                                     * @param {enum} buttonType: Has 2 States ~ @arg Translate, and @arg Revert. This will determine what function is called on the press of the button.
                                     * @param {(constant)boolean} fromLanguage: The language to translate to.
                                     * @param {(constant)boolean} toLanguage: The language to translate to
                                     * @param {(constant)boolean} isTranslated: As this check is used quite often, storing it in a variable is useful.
                                     */
                                    const fromLanguage = get(manifest.name, "DislateLangFrom", "detect");
                                    const toLanguage = get(manifest.name, "DislateLangTo", "english");
                                    const isTranslated = translateType === buttonType.Translate;

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
                                          toLang: toLanguage
                                       },
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
                                             content: `${isTranslated ? res : existingCachedObject[messageId]} ${isTranslated ? `\`[${getBoolean(manifest.name, "DislateLangAbbr", false) ? (LanguageNames[toLanguage]).toUpperCase() : Format.string(toLanguage)}]\`` : ""}`,
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
                                             ? `Modified message to ${Format.string(get(manifest.name, "DislateLangTo", "english"))}.`
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
                                 } catch (err) { 
                                    console.error(`[${manifest.name}] Local ${err} At Inner Level`); 
                                 }
                              } } />;

                           /**
                            * Inserts the React item to the list of items in the array
                            * @if {(@function findItem returns undefined)} -> Insert @param {TSX} mainElement into the @param Array.
                            *
                            * @function findItem: Searches for whether there's an existing message in the cache.
                                 * @arg {Array<object>} cachedData: The object of cached data
                                 * @arg {callback}: Checks if the Message ID is in the cache. If it is, that means it has been cached already and the state needs to be ~Revert~
                                       * @param {string} messageId: The proprietary ID of the message, which would be stored in cache later.
                                 * @arg {string} label: The label of what the function is looping. This is used for logging incase of an error and should always be provided, but is not required.
                            * @function insertItem: Inserts an item into an array.
                                 * @arg {any[]} finalLocation: The array of items to insert to.
                                 * @arg {TSX} mainElement: The main element to insert into the @param Array.
                                 * @arg {number} buttonOffset: The offset/index of where the button should be inserted
                                 * @arg {string} label: The label of what this insert function is actually doing.
                            */
                           if (!ArrayImplementations.findItem(finalLocation, (c: any) => c.key === Miscellaneous.externalPlugins.dislate, 'existing key of dislate')) {
                              ArrayImplementations.insertItem(finalLocation, mainElement, buttonOffset, "insert translate button");
                           }
                        });
                     });
                  }
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
               console.warn(
                  `[${manifest.name}] failed to initialise. Trying again in ${attempt}0s.`
               );
               /**
                * Opens an error as a Toast declaring that it is trying again in an amount of secords.
                * @if ((@param {boolean} enableToasts is true)) -> Open a toast declaring an error.
                     * @param {string} manifest.name: The name of the plugin.
                * @else () -> null
                */
               enableToasts
                  ? Toasts.open({
                     content: `[${manifest.name}] failed to initialise. Trying again in ${attempt}0s.`,
                     source: Icons.Retry,
                  })
                  : null;

               /**
                * Waits an amount of time before trying again recursively
                * @function patchActionSheet: The current function.
                * @param {number} attempt: The current attempt.
                */
               setTimeout(patchActionSheet, attempt * 10000);
            } else {
               console.error(`[${manifest.name}] failed to initialise. Giving up.`);
               /**
                * Opens an error as a Toast declaring giving up on Initialising Dislate.
                * @if ((@param {boolean} enableToasts is true)) -> Open a toast declaring an error.
                     * @param {string} manifest.name: The name of the plugin.
                * @else () -> null
                */
               enableToasts
                  ? Toasts.open({
                     content: `[${manifest.name}] failed to initialise. Giving up.`,
                     source: Icons.Failed,
                  })
                  : null;
            }
         }
      }

      /**
       * Waits 500 ms before initialising everything. This also gives FluxDispatcher time to initialise.
       * @param {function} patchActionSheet: The main ActionSheet patcher for Dislate.
       * @param {object} this.patches: The patches implemented in this plugin.
       */
      setTimeout(() => {
         patchActionSheet();
         this.patches.push(Patcher);
      }, 500);
   },

   onStop() {
      /**
       * Unpatches everything
       * @param {Command[]} this.commands
       * @param {Patch[]} this.patches
       *
       * @function Patcher.unpatchAll: Unpatches everything.
       */
      this.commands = [];
      this.patches = [];
      Patcher.unpatchAll();
   },

   getSettingsPanel({ settings }) {
      /**
       * Opens a settings panel
       * @param {TSX} Settings: React Native Page.
       */
      return <Settings
         settings={settings}
         manifest={{
            name: manifest.name,
            version: manifest.version,
            plugin: manifest.plugin,
            authors: manifest.authors,
            release: manifest.release
         }} />;
   },
};

registerPlugin(Dislate);