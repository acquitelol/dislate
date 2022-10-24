// main imports of elements and dependencies
import { FormRow } from 'enmity/components';
import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import { bulk, filters, getByProps } from 'enmity/metro'
import { React, Toasts } from 'enmity/metro/common';
import { create } from 'enmity/patcher';
import manifest from '../manifest.json';
import Settings from './components/Settings';
import { get, getBoolean } from 'enmity/api/settings';
import { findInReactTree } from 'enmity/utilities'
import { 
   translate_string, 
   format_string, 
   external_plugins, 
   find_item, 
   splice_item,
   Icons 
} from './utils';
import { translateCommand } from './components/Translate'
import { debugCommand } from './components/Debug'

// main declaration of modules being altered by the plugin
const [
   LazyActionSheet, // main patch component
   ChannelStore // to get the channel id of a message
] = bulk(
   filters.byProps("openLazy", "hideActionSheet"),
   filters.byProps("getChannel", "getDMFromUserId"),
);

// initialization of patcher
const Patcher = create('dislate');
enum buttonType {
   Translate,
   Revert
} // enum used as a sort of "boolean" for the message state

let cachedData: object[] = [{"invalid_id": "acquite sucks"}] // used for reverting messages back

const Dislate: Plugin = {
   ...manifest,
   commands: [], // start off with no commands
   patches: [], // start off with no patches

   onStart() {
      this.commands = [
         translateCommand, // translate command
         debugCommand // command to display useful debug info, sort of like /debug on enmity itself
      ]; // add the translate and debug command to the list
      let attempt = 0; // starts at attempt 0
      let attempts = 3; // max 3 attempts
      const unpatchActionSheet = () => {
            try {
               attempt++; // increases attempt
               let enableToasts = getBoolean(manifest.name, "toastEnable", false)

               const MessageStore = getByProps("getMessage", "getMessages")
               // ^^ used to get original message with all its props

               const FluxDispatcher = getByProps(
                  "_currentDispatchActionType", 
                  "_subscriptions", 
                  "_actionHandlers", 
                  "_waitQueue"
               ) // used to edit message locally to display modified language

               // wake up flux for message update
               for (const handler of ["MESSAGE_UPDATE"]) {
                  try {
                     FluxDispatcher.dispatch({
                           type: handler,
                           message: {},
                        }); // dispatch empty event to wake up flux
                  } catch(err) { console.log(`[${manifest.name} Local Error ${err}]`);}
               }

               console.log(`[${manifest.name}] delayed start attempt ${attempt}/${attempts}.`);

               enableToasts?Toasts.open({
                    content: `[${manifest.name}] start attempt ${attempt}/${attempts}.`,
                    source: Icons.Debug,
               }):console.log(`[${manifest.name}] Init Toasts are disabled.`)
               // ^^^ only opens a toast showing attempts if its enabled in settings
            
               // main patch of the action sheet
               try {
                  Patcher.before(LazyActionSheet, "openLazy", (_, [component, sheet], _res) => {
                     if (sheet === "MessageLongPressActionSheet") { // only works for the long press on message context menu
                        component.then((instance) => { // patches the component which was fetched when the openLazy event was fired
                           let default_instance = instance.default
                           instance.default = (
                              { message, user, channel, canAddNewReactions },
                              _
                           ) => {
                              let original = default_instance(
                                 { message, user, channel, canAddNewReactions },
                                 _
                              )

                              // list of different keys for external plugins
                              const externalPluginList = external_plugins()

                              // different states used throughout the thing
                              const [translateType, setTranslateType] = React.useState<buttonType>(buttonType.Translate) 

                              // returns if theres no props on res
                              if (!original.props) {
                                 console.log(`[${manifest.name} Local Error: Property "Props" Does not Exist on "res"]`)
                                 return original; // (dont do anything more)
                              }

                              // array of all buttonRow items in the lazyActionSheet
                              // let finalLocation = original?.props?.children?.props?.children?.props?.children[1]
                              let full = findInReactTree(original, r => Array.isArray(r), { walkable: ['props', 'type', 'children'] });
                              let finalLocation = full[1]
                              if (!finalLocation) {
                                 // console.log(`[${manifest.name} Local Error: 'finalLocation' seems to be undefined!]`)
                                 return original; // (dont do anything more)
                              }
                              // if any of these dont exist, it will return undefined instead of throwing an error

                              /* calculates (
                                 where it would put the translate button 
                                 &&
                                 where the button is currently
                              )*/
                              const [buttonOffset, setButtonOffset] = React.useState<number>(0)
                              React.useEffect(() => {
                                 Object.values(externalPluginList).forEach(index => {
                                    if (find_item(finalLocation, 'external plugin list', (c: any) => {
                                       if (c.key!==externalPluginList.dislate) {
                                          return c.key === index
                                       }
                                    })) {setButtonOffset((previous: number) => previous+1)}
                                 })
                                 if (find_item(finalLocation, 'reply button', (a: any) => a.props?.message==="Reply")) {
                                    // you can reply
                                    setButtonOffset((previous: number) => previous+1)
                                 }
                                 if (find_item(finalLocation, 'edit message button', (a: any) => a.props?.message==="Edit Message")) {
                                    // you can edit
                                    setButtonOffset((previous: number) => previous+1)
                                 }
                              }, [])
                              // gets original message sent by user based on the params from the component
                              const originalMessage = MessageStore.getMessage(
                                 channel.id,
                                 message.id
                              ); // this object contains all the info from the message such as author and content etc

                              // return if theres no content (likely an attachment or embed with no content)
                              if (!originalMessage.content) { 
                                 console.log(`[${manifest.name}] No message content.`)
                                 return original
                              };
                              
                              const messageId = originalMessage.id // the id of the message that was long pressed
                              const messageContent = originalMessage.content // the content of the message that was long pressed (not undefined because checked above)
                              const findExistingObject = find_item(cachedData, 'cache object', (o: any) => Object.keys(o)[0] === messageId) // try to find an existing object in cache, will return undefined if nothing found
                              
                              React.useEffect(() => {
                                 setTranslateType(findExistingObject
                                    ? buttonType.Revert
                                    : buttonType.Translate
                                 ) // set the button's state to whether the message has been translated or not
                              }, setTranslateType)

                              // let ButtonRow = finalLocation[finalLocation.length - 1].type

                              const formElem = <FormRow
                                 key={externalPluginList.dislate} // for no new items every time, 100% required
                                 label={`${translateType===buttonType.Translate?"Translate":"Revert"}` /*change the label depending on the current state*/}
                                 leading={<FormRow.Icon source={translateType===buttonType.Translate
                                       ?Icons.Translate
                                       :Icons.Revert} /> /* change the icon of the button depending on the current state */}
                                 onPress={() => {
                                    try{
                                       if (translateType===buttonType.Translate) { // does a different function depending on the state
                                          const from_language = get(manifest.name, "DislateLangFrom", "detect") // language to translate from
                                          const to_language = get(manifest.name, "DislateLangTo", "japanese") // language to translate to

                                          // translates message into language from settings
                                          translate_string( // main function based on utils/index.tsx
                                             originalMessage.content, // the valid content from the message sent
                                             from_language, // the language to translate from, default is detect/automatic
                                             to_language // the language to translate to, the default is japanese
                                          ).then(res => { // what to do after the message gets returned from the translate function (async)
                                             // updates the message clicked with the new content and language translated to
                                             const editEvent = { // used for flux dispatcher to edit locally
                                                type: "MESSAGE_UPDATE",
                                                message: {
                                                   ...originalMessage,
                                                   content:
                                                         // res is the message content, and it puts the language that it translated to as a mini code block
                                                         `${res} \`[${format_string(to_language)}]\``,
                                                   guild_id: ChannelStore.getChannel(
                                                         originalMessage.channel_id
                                                   ).guild_id,
                                                },
                                                log_edit: false // doesnt log edit request in debug logs
                                             };
                                             // dispatches the event
                                             FluxDispatcher.dispatch(editEvent);

                                             // opens a toast to declare success
                                             Toasts.open({ 
                                                // formats the string and shows language that it has changed it to
                                                content: `Modified message to ${format_string(get(manifest.name, "DislateLangTo", "japanese"))}.`, 
                                                source: Icons.Translate
                                             })

                                             // add the message id and content to the cache to be reverted later
                                             cachedData.unshift({
                                                [messageId]: messageContent
                                             })
                                          })
                                             
                                          // hides the action sheet
                                          LazyActionSheet.hideActionSheet() // function on the LazyActionSheet module
                                       } else if (translateType===buttonType.Revert) {
                                          // updates the message clicked with the new content and language translated to
                                          const editEvent = { // used for flux dispatcher to edit locally
                                             type: "MESSAGE_UPDATE",
                                             message: {
                                                ...originalMessage,
                                                content:
                                                   findExistingObject[messageId],
                                                guild_id: ChannelStore.getChannel(
                                                      originalMessage.channel_id
                                                ).guild_id,
                                             },
                                             log_edit: false // doesnt log edit request in debug logs
                                          };
                                          // dispatches the event
                                          FluxDispatcher.dispatch(editEvent);

                                          // opens a toast to declare success
                                          Toasts.open({ 
                                             // formats the string and shows language that it has changed it to
                                             content: `Reverted message back to original state.`, 
                                             source: Icons.Translate
                                          })

                                          // gets all elements from the cache array except the one that was just reverted (basically just removes the element from the array)
                                          let changedArray = cachedData.filter(e => e!==findExistingObject)
                                          cachedData=changedArray // sets it back to the original cache array
                                          // doing it this way instead of pop() or shift() means that i can revert any message sent at any time, not just the most recent message sent ^^^

                                          // hides the action sheet
                                          LazyActionSheet.hideActionSheet() // function on the LazyActionSheet module
                                       }
                                    } catch(err) { console.log(`[Dislate Local Error ${err}]`);}
                                    
                                 }} />

                                 if (!find_item(finalLocation, 'existing key of dislate', (c: any) => c.key === externalPluginList.dislate)) {
                                    // add element to the form
                                    splice_item(finalLocation, formElem, buttonOffset, "insert translate button")
                                 }

                                 return original
                           }
                           return instance
                        });
                     }
                  })
               } catch(err) {
                  // log any errors that would happen
                  console.log(`[${manifest.name} Local Error ${err}]`);
                  let enableToasts = getBoolean(manifest.name, "toastEnable", false) // checks if you have the init toasts setting enabled to alert you in app
                  enableToasts?
                  Toasts.open({
                     content: `[${manifest.name}] failed to open action sheet.`,
                     source: Icons.Retry,
                  }):console.log(`[${manifest.name}] Init toasts are disabled.`)
               }
            } catch(err) {
               // log any errors that would happen
               console.log(`[${manifest.name} Local Error ${err}]`);
               let enableToasts = getBoolean(manifest.name, "toastEnable", false) // checks if you have the init toasts setting enabled to alert you in app

                if (attempt < attempts) { // only tries again if it attempted less than 3 times
                    console.warn(
                        `[${manifest.name}] failed to start. Trying again in ${attempt}0s.`
                    );
                    enableToasts?
                    Toasts.open({
                        content: `[${manifest.name}] failed to start. Trying again in ${attempt}0s.`,
                        source: Icons.Retry,
                    }):console.log(`[${manifest.name}] Init toasts are disabled.`)

                    // waits the amount of time extra each attempt to allow for init of any services
                    setTimeout(unpatchActionSheet, attempt * 10000); 
                } else {
                     // gives up on attempting to init dislate
                    console.error(`[${manifest.name}] failed to start. Giving up.`);
                    enableToasts? // only sends if toast options are enabled
                    Toasts.open({
                        content: `[${manifest.name}] failed to start. Giving up.`,
                        source: Icons.Failed,
                    }):console.log(`[${manifest.name}] Init toasts are disabled.`)
                }
            }
      }

      setTimeout(() => {
         unpatchActionSheet(); // calls the function (code is synchronous so this will work)
         this.patches.push(Patcher)
      }, 300); // gives flux time to init
   },

   onStop() {
      // unpatches everything, and clears commands
      this.commands = [];
      this.patches = [];
      Patcher.unpatchAll();
   },

   getSettingsPanel({ settings }) {
      return <Settings settings={settings} />;
   },
};

registerPlugin(Dislate);