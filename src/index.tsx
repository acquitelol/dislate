// main imports of elements and dependencies
import { FormRow } from 'enmity/components';
import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import { getIDByName } from 'enmity/api/assets';
import { bulk, filters, getByProps } from 'enmity/metro'
import { React, Toasts } from 'enmity/metro/common';
import { create } from 'enmity/patcher';
import manifest from '../manifest.json';
import Settings from './components/Settings';
import { get, getBoolean } from 'enmity/api/settings';
import { translateString, formatString, external_plugins } from './utils';
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
               let enableToasts = getBoolean("Dislate", "toastEnable", false)

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
                  } catch(err) { console.log(`[Dislate Local Error ${err}]`);}
               }

               console.log(`[Dislate] delayed start attempt ${attempt}/${attempts}.`);

               enableToasts?Toasts.open({
                    content: `[Dislate] start attempt ${attempt}/${attempts}.`,
                    source: getIDByName('debug'),
               }):console.log("[Dislate] Init Toasts are disabled.")
               // ^^^ only opens a toast showing attempts if its enabled in settings
            
               // main patch of the action sheet
               Patcher.before(LazyActionSheet, "openLazy", (_, [component, sheet], _res) => {
                  if (sheet === "MessageLongPressActionSheet") { // only works for the long press on message context menu
                     component.then((instance) => { // patches the component which was fetched when the openLazy event was fired
                        Patcher.after(instance, "default", (_, message, res) => {
                           // list of different keys for external plugins
                           const externalPluginList = external_plugins()

                           // different states used throughout the thing
                           const [translateType, setTranslateType] = React.useState<buttonType>(buttonType.Translate) 

                           // returns if theres no props on res
                           if (!res.props) {
                              console.log(`[Dislate Local Error: Property "Props" Does not Exist on "res"]`)
                              return res; // (dont do anything more)
                           }

                           // array of all buttonRow items in the lazyActionSheet
                           const finalLocation = res?.props?.children?.props?.children?.props?.children[1]
                           // if any of these dont exist, it will return undefined instead of throwing an error

                           /* calculates (
                              where it would put the translate button 
                              &&
                              where the button is currently
                           )*/
                           const [buttonOffset, setButtonOffset] = React.useState<number>(-1)
                           React.useEffect(() => {
                              Object.values(externalPluginList).forEach(index => {
                                 if (finalLocation.find((c: any) => c.key == index)) {setButtonOffset((previous: number) => previous+1)}
                              })
                              if (finalLocation.find((a: any) => a.props?.message=="Reply")) {
                                 // you can reply
                                 setButtonOffset((previous: number) => previous+1)
                              }
                              if (finalLocation.find((a: any) => a.props?.message=="Edit Message")) {
                                 // you can edit
                                 setButtonOffset((previous: number) => previous+1)
                              }
                           }, [])
                           // gets original message sent by user based on the params from the component
                           const originalMessage = MessageStore.getMessage(
                              message[0].message.channel_id,
                              message[0].message.id
                           ); // this object contains all the info from the message such as author and content etc

                           // return if theres no content (likely an attachment or embed with no content)
                           if (!originalMessage.content) { return console.log("[Dislate] No message content.") };
                           
                           const messageId = originalMessage.id // the id of the message that was long pressed
                           const messageContent = originalMessage.content // the content of the message that was long pressed (not undefined because checked above)
                           const findExistingObject = cachedData.find(o => Object.keys(o)[0] === messageId) // try to find an existing object in cache, will return undefined if nothing found
                           
                           React.useEffect(() => {
                              setTranslateType(findExistingObject
                                 ? buttonType.Revert
                                 : buttonType.Translate
                              ) // set the button's state to whether the message has been translated or not
                           }, setTranslateType)

                           const formElem = <FormRow
                              key={externalPluginList.dislate} // for no new items every time, 100% required
                              label={`${translateType===buttonType.Translate?"Translate":"Revert"}` /*change the label depending on the current state*/}
                              leading={<FormRow.Icon source={translateType===buttonType.Translate
                                    ?getIDByName('img_nitro_star')
                                    :getIDByName('ic_highlight')} /> /* change the icon of the button depending on the current state */}
                              onPress={() => {
                                 try{
                                    if (translateType===buttonType.Translate) { // does a different function depending on the state
                                       // translates message into language from settings
                                       translateString( // main function based on utils/index.tsx
                                          originalMessage.content, // the valid content from the message sent
                                          get("Dislate", "DislateLangFrom", "detect"), // the language to translate from, default is detect/automatic
                                          get("Dislate", "DislateLangTo", "japanese") // the language to translate to, the default is japanese
                                       ).then(res => { // what to do after the message gets returned from the translate function (async)
                                          // updates the message clicked with the new content and language translated to
                                          const editEvent = { // used for flux dispatcher to edit locally
                                             type: "MESSAGE_UPDATE",
                                             message: {
                                                ...originalMessage,
                                                content:
                                                      // res is the message content, and it puts the language that it translated to as a mini code block
                                                      `${res} \`[${formatString(get("Dislate", "DislateLangTo", "japanese"))}]\``,
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
                                             content: `Modified message to ${formatString(get("Dislate", "DislateLangTo", "japanese"))}.`, 
                                             source: getIDByName('img_nitro_star')
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
                                          source: getIDByName('img_nitro_star')
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

                              if (!finalLocation.find(c => c.key === externalPluginList.dislate)) {
                                 // add element to the form
                                 finalLocation.splice(buttonOffset, 0, formElem) 
                              }
                              
                        })
                     });
                  }
               })
            } catch(err) {
               // log any errors that would happen
               console.log(`[Dislate Local Error ${err}]`);
               let enableToasts = getBoolean("Dislate", "toastEnable", false) // checks if you have the init toasts setting enabled to alert you in app

                if (attempt < attempts) { // only tries again if it attempted less than 3 times
                    console.warn(
                        `[Dislate] failed to start. Trying again in ${attempt}0s.`
                    );
                    enableToasts?
                    Toasts.open({
                        content: `[Dislate] failed to start trying again in ${attempt}0s.`,
                        source: getIDByName('ic_message_retry'),
                    }):console.log("[Dislate] Init toasts are disabled.")

                    // waits the amount of time extra each attempt to allow for init of any services
                    setTimeout(unpatchActionSheet, attempt * 10000); 
                } else {
                     // gives up on attempting to init dislate
                    console.error(`[Dislate] failed to start. Giving up.`);
                    enableToasts? // only sends if toast options are enabled
                    Toasts.open({
                        content: `[Dislate] failed to start. Giving up.`,
                        source: getIDByName('Small'),
                    }):console.log("[Dislate] Init toasts are disabled.")
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