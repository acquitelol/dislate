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
import { translateString, formatString } from './utils';


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

const Dislate: Plugin = {
   ...manifest,
   onStart() {
      let attempt = 0; // starts at attempt 0
      let attempts = 3; // max 3 attempts
      const unpatchActionSheet = () => {
            try {
               attempt++; // increases attempt
               let masterDisableBool = getBoolean("Dislate", "masterDisable", false)
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
                           const calculateIndex = () => {
                              // adds 1 to the index if invischat is active
                              const sheetIndex = (invisChat: number) => {
                                 if (finalLocation[0+invisChat]?.props?.message=='Reply') {
                                    // its not your message but you can reply
                                    return 1+invisChat 
                                 } else if (finalLocation[1+invisChat]?.props?.message=='Reply') {
                                    // its your message
                                    return 2+invisChat 
                                 }
                                 // its not your message and you cant reply
                                 return 0+invisChat 
                              }
                              // main logic
                              if (finalLocation[0].key=='420') { // only returns early if the key of the 0th element is 420 (invisCHat is active)
                                 // return an extra 1 to the index to account for InvisChat
                                 return sheetIndex(1) 
                              }
                              // return default of 0
                              return sheetIndex(0) 
                         }

                           // doesnt place a new element if its already there {returns early}
                           if(finalLocation[calculateIndex()].key=='1002') { return }
                           // gets original message sent by user based on the params from the component
                           const originalMessage = MessageStore.getMessage(
                              message[0].message.channel_id,
                              message[0].message.id
                           ); // this object contains all the info from the message such as author and content etc

                           // return if theres no content (likely an attachment or embed with no content)
                           if (!originalMessage.content) { return console.log("[Dislate] No message content.") };
                           
                           // returns if the timestamp is invalid already (plugin messes with it)
                           try {
                              if (!message[0].edited_timestamp._isValid) return;
                           } catch { }
                           
                           const formElem = <FormRow
                              key={`1002`} // for no new items every time, 100% required
                              label='Translate'
                              leading={<FormRow.Icon source={getIDByName('img_nitro_star')} />}
                              onPress={() => {
                                 try{
                                    if ( // only runs if there isnt a timestamp already
                                       !originalMessage?.editedTimestamp ||
                                       originalMessage?.editedTimestamp._isValid
                                    ) {
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
                                                edited_timestamp: "invalid_timestamp", // set an invalid timestamp so it doesnt run again when you click translate (translating nothing)
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
                                       })
                                       
                                    }
                                    // hides the action sheet
                                    LazyActionSheet.hideActionSheet() // function on the LazyActionSheet module
                                 } catch(err) { console.log(`[Dislate Local Error ${err}]`);}
                                 
                              }} />
                              // add element to the form
                              finalLocation.splice(calculateIndex(), 0, formElem) 
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
      }, 300); // gives flux time to init
   },

   onStop() {
      // unpatches everything
      Patcher.unpatchAll();
   },

   getSettingsPanel({ settings }) {
      return <Settings settings={settings} />;
   },
};

registerPlugin(Dislate);