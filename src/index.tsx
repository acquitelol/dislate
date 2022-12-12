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
 * @param translate_command: The main command to send a translated message. Trigger: @arg {/translate text:{string} language:{option}} 
 * @param debug_command: The main command to debug @arg Dislate. Trigger: @arg {/dislate type:{option}}
 * @param Settings: The main settings page.
 * @param lang_names: The key pair list of languages and their abbreviated forms.
 */
import { FormRow } from 'enmity/components';
import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import { bulk, filters, getByProps } from 'enmity/metro'
import { React, Toasts } from 'enmity/metro/common';
import { create } from 'enmity/patcher';
import manifest from '../manifest.json';
import { get, getBoolean } from 'enmity/api/settings';
import { 
   translate_string, 
   format_string, 
   external_plugins, 
   find_item, 
   insert_item,
   for_item,
   Icons, 
   check_if_compatible_device,
   filter_item
} from './utils';
import { translate_command } from './components/Translate'
import { debug_command } from './components/Debug'
import Settings from './components/Settings';
import lang_names from '../modified/translate/src/languages/names';

/**  
 * Top Level Bulk-Filter Variable Declaration --
 * @param {any} LazyActionSheet: The main ActionSheet which I would patch into
 * @param {any} ChannelStore: Allows you to get the current channel
*/
const [
   LazyActionSheet,
   ChannelStore
] = bulk(
   filters.byProps("openLazy", "hideActionSheet"),
   filters.byProps("getChannel", "getDMFromUserId"),
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
}

/** 
 * Top Level Cache Variables --
 * @param {object} cached_data: The main object which holds cached data. This data persists for only each instance of Enmity, so if you restart the app it will clear. It stores this data so that it can detect if a message has been translated yet and change the button (based on {buttonType}) to Revert.
 */
let cached_data: object[] = [{"invalid_id": "acquite sucks"}]

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
       * @param {Command} translate_command: The main command of </translate:1> which allows you to send translated messages with the following format:
            * @param {string} text: The text you want to translate.
            * @param {string[]} language: The language you want to translate to (array).
       * @param {Command} debug_command: The main debug info command of </dislate:1> which allows you to do the following
            * @param {string} Debug: Send a customizable Debug Information message.
            * @param {string} Download: Get a download link of Dislate copied to clipboard.
            * @param {string} Repo: Open the repo of Dislate externally.
       */
      this.commands = [
         translate_command,
         debug_command
      ];

      /** 
       * Attempts to patch the ActionSheet --
       * @param {(mutable)number} attempt: The current attempt that the Patcher is on, the default is 0 obviously
       * @param {(constant)number} max_attempts: The maximum amount of attempts before giving up. This is set to 3.
       */
      let attempt = 0
      const max_attempts = 3;

      /** 
       * Main Patcher function to attempt and patch into the ActionSheet --
       * @function patch_action_sheet: Tries to patch Dislate based on @var max_attempts;
       * @returns {void}, as nothing is required to be returned
       */
      async function patch_action_sheet(): Promise<void> {
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
               const MessageStore = getByProps("getMessage", "getMessages")
               const FluxDispatcher = getByProps(
                  "_currentDispatchActionType", 
                  "_subscriptions", 
                  "_actionHandlers", 
                  "_waitQueue"
               )

               /** 
                * Option in settings to check whether the user has enabled init toasts.
                * @param {boolean} enable_toasts: Whether the user has checked "initialisation toasts" in Plugin Settings.
                */
               let enable_toasts = getBoolean(manifest.name, "toastEnable", false)

               /** 
                * Runs a simple check to see if a device is compatible for Dislate to be used.
                * @function check_if_compatible_device: Opens a dialog if incompatible
                * @returns {void}
                */
               await check_if_compatible_device()

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
                  } catch(err) { console.log(`[${manifest.name} Local Error ${err}]`);}
               }

               /** 
                * Simple log in the console showing the current attempt and max attempts
                * @param {string} manifest.name: The name of the plugin. In this case, its "Dislate"
                * @param {number} attempt: The current attempt.
                * @param {number} max_attempts: The maximum amount of attempts
                * 
                ** Also uses a ternary operator to check if it should open a toast.
                * @param {boolean} enable_toasts: The state of initialisation toasts in settings.
                */
               console.log(`[${manifest.name}] delayed start attempt ${attempt}/${max_attempts}.`);
               enable_toasts
                  ?  Toasts?.open({
                        content: `[${manifest.name}] start attempt ${attempt}/${max_attempts}.`,
                        source: Icons.Debug,
                     })
                  :  null;

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
                               * Fetching the list of external plugins' keys which also patch the ActionSheet.
                               * @param {(constant)object} external_plugin_list: The main list of keys which will be looped over later. Fetched from ./utils/index.ts
                               */
                              const external_plugin_list = external_plugins

                              /** 
                               * Uses a React UseState Hook to toggle between the Translate and Revert state and re-render the component based on it.
                               * @param {[Setter, Getter]} TranslateType: The main state of whether the button is in the @param {enum} Translate or @param {enum} Revert state.
                               * @param {[Setter, Getter]} ButtonOffset: This starts off at 0 and increases by 1 for each time a FormRow with an external key is found. This would be then added on to the index of where to place the button. This deals with issues of interfering plugins.
                               * 
                               * @param {enum} buttonType.Translate: The default value of @param {[Setter, Getter]} TranslateType, as an @arg enum.
                               * @param {enum} buttonType: The main enum for toggling the state, used as a @arg Generic type.
                               * @param {number}: The @arg Generic type used for @param {[Setter, Getter]} ButtonOffset, with @param {number} 0 as the default.
                               */
                              const [translateType, setTranslateType] = React.useState<buttonType>(buttonType.Translate) 
                              const [buttonOffset, setButtonOffset] = React.useState<number>(0)

                              /** 
                               * Checks if @param {object} res has a "props" property as its required for the rest of the code to function
                               * @if {(@param {(nullable)unknown} res.props) is falsey} -> Return early and log an error to console.
                               * @param {string} manifest.name: The name of the plugin in manifest. This would be Dislate in this case.
                               */
                              if (!res?.props) {
                                 console.log(`[${manifest.name} Local Error: Property "Props" Does not Exist on "res"]`)
                                 return res;
                              }

                              /** 
                               * This would be classified as the final location of the actionSheet. This is an array of all the ButtonRow items (and any FormRow items from other plugins)
                               * @param {any[]} final_location: The final location of items that Dislate modifies later.
                               */
                              let final_location = res?.props?.children?.props?.children?.props?.children[1]
                              
                              /** 
                               * Checks if @param {object} final_location exists as its required to prevent a crash
                               * @if {(@param {(nullable)unknown} final_location) is falsey} -> Return early and log an error to console.
                               * @param {string} manifest.name: The name of the plugin in manifest. This would be Dislate in this case.
                               */
                              if (!final_location) {
                                 console.log(`[${manifest.name} Local Error: 'finalLocation' seems to be undefined!]`)
                                 return res;
                              }
                              
                              /** 
                               * Uses a single useEffect hook this render to check whether any external plugins are installed through the keys of them which were fetched earlier.
                               * @function for_item: Loops through a list with a callback as the second argument. Custom implementation of forEach, imported from ./utils/index.ts
                                    * @arg {Array}: The array which the function would loop through.
                                    * @arg {callback}: This would run on each iteration of the loop.
                                    * @arg {string} label: The label of what the function is looping. This is used for logging incase of an error and should always be provided, but is not required.
                               */
                              React.useEffect(() => {
                                 for_item(Object.values(external_plugin_list), (index: number) => {
                                    /** 
                                     * Checks if it can find an index in this list which isn't the one used for Dislate.
                                     * @if {(@function find_item) is not falsey} -> Increment @param {number} ButtonOffset   
                                     * 
                                     * @function find_item: Tries to find a specified item in a list
                                          * @arg {Array} final_location: The array to check
                                          * @arg {string} label: The label of what the function is searching for. This is used for logging incase of an error and should always be provided, but is not required.
                                     * @returns {any || undefined}: an item which was found or undefined if it didn't find anything
                                     */
                                    if (find_item(final_location, (item: any) => {
                                       /** 
                                        * Requires that any items which match are not the key used for Dislate.
                                        * @if ((@param {string} item.key) is not (@param {string} external_plugin_list.dislate)) -> Filter it to only ones which aren't Dislate's key
                                        * @returns {any} keys which don't equal the one used in Dislate but match the keys used in other plugins.
                                       */
                                       if (item.key!==external_plugin_list.dislate) {
                                          return item.key === index
                                       }
                                    }, 'external plugin list')) setButtonOffset((previous: number) => previous+1)
                                 }, "looping through external plugin keys")
                                 /** 
                                  * Check if a Reply and Edit Message button exists, and increment the counter based on which are @param {boolean} true.
                                  * @if {(@function find_item) is not falsey} -> Increment @param {number} ButtonOffset
                                  * 
                                  * @function find_item: Searches for whether there's a Reply or Edit Message Button.
                                       * @param {Array} final_location: The final location array of the plugin
                                       * @param {callback}: Checks if the item's props's message is identical to the one used in Reply or Edit Message, meaning that its a valid button.
                                             * @param {string} item.props.message: The label/message of the Button.
                                       * @arg {string} label: The label of what the function is looping. This is used for logging incase of an error and should always be provided, but is not required.
                                  */
                                 if (find_item(final_location, (item: any) => item.props?.message==="Reply", 'reply button')) setButtonOffset((previous: number) => previous + 1)
                                 if (find_item(final_location, (item: any) => item.props?.message==="Edit Message", 'edit message button')) setButtonOffset((previous: number) => previous + 1)
                              }, [])

                              /** 
                               * Fetch the proprietary original message from the MessageStore
                               * @param {object} original_message: The original message with properties such as @arg content or @arg id
                               * 
                               * @function MessageStore.getMessage: Fetches a message based on its Message ID and Channel ID.
                                    * @param {string} message[0].message.channel_id: The Channel ID of the message being fetched
                                    * @param {string} message[0].message.id: The Proprietary ID of the message being fetched
                               * @returns {object}: Object of data from the original message on the server side.
                               */
                              const original_message = MessageStore.getMessage(
                                 message[0]?.message?.channel_id,
                                 message[0]?.message?.id
                              );

                              /** 
                               * Return early if it cannot find any content in either of the original message nor the actual message, meaning its likely an embed or attachment with no content.
                               * @if {(@param {string} original_message.content is falsey) <AND> (@param {string} message[0].message.content is falsey)} -> Return early as the message has no translateable content.
                               */
                              if (!original_message?.content && !message[0]?.message?.content) { 
                                 console.log(`[${manifest.name}] No message content.`)
                                 return res;
                              }
                              
                              /** 
                               * Gets useful data in this specific lexical scope
                               * @param {string} message_id: The ID of the message which will be modified.
                               * @param {string} message_content: The content of the message, which will be translated later.
                               * @param {object || undefined} existing_cached_object: Finds a cached object from the message cache. Can be @arg undefined.
                               * 
                               * @function find_item: Searches for whether there's an existing message in the cache.
                                    * @arg {Array<object>} cached_data: The object of cached data
                                    * @arg {callback}: Checks if the Message ID is in the cache. If it is, that means it has been cached already and the state needs to be ~Revert~
                                          * @param {string} message_id: The proprietary ID of the message, which would be stored in cache later.
                                    * @arg {string} label: The label of what the function is looping. This is used for logging incase of an error and should always be provided, but is not required.
                               */
                              const message_id = original_message?.id ?? message[0]?.message?.id
                              const message_content = original_message?.content ?? message[0]?.message?.content
                              const existing_cached_object = find_item(cached_data, (o: any) => Object.keys(o)[0] === message_id, 'cache object')
                              
                              /** 
                               * Set the Button's enum type to whichever is needed based on whether any object in the cache was found, using a ternary operator. Uses the setter as the dependency array so its a single call.
                               * @param {object || undefined} existing_cached_object: Finds a cached object from the message cache. Can be @arg undefined.
                               * @param {enum} buttonType: Has 2 States ~ @arg Translate, and @arg Revert.
                               * 
                               * @function React.useEffect: Takes a callback and runs this callback everytime the value(s) in the dependency array change(s).
                                    * @arg {callback}: The callback to run.
                                    * @arg {any[]}: The dependency array.
                               */
                              React.useEffect(() => {
                                 setTranslateType(existing_cached_object
                                    ?  buttonType.Revert
                                    :  buttonType.Translate
                                 )
                              }, setTranslateType)

                              const main_element = <FormRow
                                 /**
                                  * This is a TSX/JSX Element, and uses props in this way.
                                  * @param {string} key: This is used to prevent duplicate rendering of the button. Set with @arg external_plugin_list.dislate.
                                  * @param {string} label: The label of the button. This is the text that will actually appear on as the button's Text. Shows Translate or Revert depending on whether the current type is @arg buttonType.Translate or not.
                                  * @param {icon} leading: The icon that will display before the button's text.
                                  * @param {function} onPress: The event fired when the button is pressed.
                                  */
                                 key={external_plugin_list.dislate}
                                 label={`${translateType===buttonType.Translate?"Translate":"Revert"}`}
                                 leading={<FormRow.Icon source={translateType===buttonType.Translate
                                       ?  Icons.Translate
                                       :  Icons.Revert
                                 } />}
                                 onPress={() => {
                                    try{
                                       /**
                                        * @param {enum} translateType: The current translate type based on the cache from earlier.
                                        * @param {enum} buttonType: Has 2 States ~ @arg Translate, and @arg Revert. This will determine what function is called on the press of the button.
                                        * @param {(constant)boolean} from_language: The language to translate to.
                                        * @param {(constant)boolean} to_language: The language to translate to
                                        * @param {(constant)boolean} is_translated: As this check is used quite often, storing it in a variable is useful. 
                                        */
                                       const from_language = get(manifest.name, "DislateLangFrom", "detect")
                                       const to_language = get(manifest.name, "DislateLangTo", "english")
                                       const is_translated = translateType===buttonType.Translate;

                                       /** 
                                        * Translates a string and reverts it back based on if it exists or not.
                                        * @function translate_string: Translates a string
                                             * @arg {string} original_message.content: The content of the message
                                             * @arg {string} from_language: The language to translate from.
                                             * @arg {string} to_language: The language to translate to.
                                             * @arg {boolean} is_translated: If this is true, it just straight up returns the content without translating it. It's a hacky fix, but it saves a lot of code repetition.
                                        */
                                       translate_string(
                                          original_message.content,
                                          {
                                             fromLang: from_language,
                                             toLang: to_language
                                          },
                                          !is_translated
                                       ).then(res => { 
                                          /** 
                                           * Edit the message in the correct context
                                           * @param {object} edit_event: The main edit event which will be fired by @arg FluxDispatcher.
                                                * @arg {string} type: The type of update, by default this is @param {string} MESSAGE_UPDATE.
                                                * @arg {object} message: The main message with all attributes.
                                                      * @arg {string} content: The content of the message.
                                                      * @arg {string} guild_id: The channel_id of the message.  
                                                * @arg {boolean} log_edit: Whether it should log this edit event to Debug Logs.
                                           *
                                          */
                                          const edit_event = {
                                             type: "MESSAGE_UPDATE",
                                             message: {
                                                ...original_message,
                                                content: 
                                                   `${is_translated ? res : existing_cached_object[message_id]} ${is_translated ? `\`[${getBoolean(manifest.name, "DislateLangAbbr", false) ? (lang_names[to_language]).toUpperCase() : format_string(to_language)}]\`` : ""}`,
                                                guild_id: ChannelStore.getChannel(
                                                      original_message.channel_id
                                                ).guild_id,
                                             },
                                             log_edit: false
                                          };

                                          /**
                                           * @function FluxDispatcher.dispatch: Fires an event to FluxDispatcher.
                                                * @arg {object} edit_event 
                                           */
                                          FluxDispatcher.dispatch(edit_event);

                                          /** 
                                           * Open a toast to declare whether the string was translated or reverted.
                                           * @param {string} content: The content of the toast.
                                           * @param {unknown} source: The source icon of the toast.
                                           * 
                                           * @function format_string: Adds a capital letter to the start of the string.
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
                                             content: is_translated
                                                ? `Modified message to ${format_string(get(manifest.name, "DislateLangTo", "english"))}.`
                                                : `Reverted message back to original state.`, 
                                             source: Icons.Translate
                                          })

                                          /** 
                                           * Either adds or removes the object from cache depending if it has been translated already.
                                           * @if {(@param {boolean} is_translated is not false)} -> Add the new object to @param {(mutable)Array<object>} cached_data.
                                           * @else {()} -> Filter @param {object} cached_data and set it to itself
                                           */
                                          is_translated 
                                             ? cached_data.unshift({[message_id]: message_content}) 
                                             : cached_data = filter_item(cached_data, (e: any) => e!==existing_cached_object, 'cached data override')
                                       })
                                          
                                       /** 
                                        * Hides the ActionSheet
                                        * @function LazyActionSheet.hideActionSheet: Hides an action sheet.
                                        */
                                       LazyActionSheet.hideActionSheet()
                                    } catch(err) { console.log(`[Dislate Local Error ${err}]`);}
                                 }} />

                                 /** 
                                  * Inserts the React item to the list of items in the array
                                  * @if {(@function find_item returns undefined)} -> Insert @param {TSX} main_element into the @param Array.
                                  * 
                                  * @function find_item: Searches for whether there's an existing message in the cache.
                                       * @arg {Array<object>} cached_data: The object of cached data
                                       * @arg {callback}: Checks if the Message ID is in the cache. If it is, that means it has been cached already and the state needs to be ~Revert~
                                             * @param {string} message_id: The proprietary ID of the message, which would be stored in cache later.
                                       * @arg {string} label: The label of what the function is looping. This is used for logging incase of an error and should always be provided, but is not required.
                                  * @function insert_item: Inserts an item into an array.
                                       * @arg {any[]} final_location: The array of items to insert to.
                                       * @arg {TSX} main_element: The main element to insert into the @param Array.
                                       * @arg {number} buttonOffset: The offset/index of where the button should be inserted
                                       * @arg {string} label: The label of what this insert function is actually doing.
                                  */
                                 if (!find_item(final_location, (c: any) => c.key === external_plugin_list.dislate, 'existing key of dislate')) {
                                    insert_item(final_location, main_element, buttonOffset, "insert translate button")
                                 }
                           })
                        });
                     }
                  })
               } catch(err) {
                  console.log(`[${manifest.name} Local Error ${err}]`);
                  /** 
                   * Opens an error as a Toast
                   * @if {(@param {boolean} enable_toasts is true)} -> Open a toast declaring an error.
                        * @param {string} manifest.name: The name of the plugin. 
                   * @else {()} -> null
                   */
                  enable_toasts
                     ?  Toasts.open({
                           content: `[${manifest.name}] failed to open action sheet.`,
                           source: Icons.Retry,
                        })
                     :  null
               }
            } catch(err) {
               console.error(`[${manifest.name} Local Error ${err}]`);
               let enable_toasts = getBoolean(manifest.name, "toastEnable", false)

               if (attempt < max_attempts) {
                  console.warn(
                     `[${manifest.name}] failed to start. Trying again in ${attempt}0s.`
                  );
                  /** 
                   * Opens an error as a Toast declaring that it is trying again in an amount of secords.
                   * @if ((@param {boolean} enable_toasts is true)) -> Open a toast declaring an error.
                        * @param {string} manifest.name: The name of the plugin. 
                   * @else () -> null
                   */
                  enable_toasts
                     ?  Toasts.open({
                           content: `[${manifest.name}] failed to start. Trying again in ${attempt}0s.`,
                           source: Icons.Retry,
                        })
                     :  null

                  /** 
                   * Waits an amount of time before trying again recursively
                   * @function patch_action_sheet: The current function.
                   * @param {number} attempt: The current attempt.
                   */
                  setTimeout(patch_action_sheet, attempt * 10000); 
               } else {
                  console.error(`[${manifest.name}] failed to start. Giving up.`);
                  /** 
                   * Opens an error as a Toast declaring giving up on Initialising Dislate.
                   * @if ((@param {boolean} enable_toasts is true)) -> Open a toast declaring an error.
                        * @param {string} manifest.name: The name of the plugin. 
                   * @else () -> null
                   */
                  enable_toasts
                     ?  Toasts.open({
                           content: `[${manifest.name}] failed to start. Giving up.`,
                           source: Icons.Failed,
                        })
                     :  null
               }
            }
      }

      /** 
       * Waits 500 ms before initialising everything. This also gives FluxDispatcher time to initialise.
       * @param {function} patch_action_sheet: The main ActionSheet patcher for Dislate.
       * @param {object} this.patches: The patches implemented in this plugin.
       */
      setTimeout(() => {
         patch_action_sheet();
         this.patches.push(Patcher)
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
         }}
      />;
   },
};

registerPlugin(Dislate);