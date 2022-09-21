// main imports of elements and dependencies
import { FormRow } from 'enmity/components';
import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import { getIDByName } from 'enmity/api/assets';
import { bulk, filters } from 'enmity/metro';
import { React, Toasts } from 'enmity/metro/common';
import { create } from 'enmity/patcher';
import manifest from '../manifest.json';
import Settings from './components/Settings';
import { get, getBoolean } from 'enmity/api/settings';
import { translateString, formatString } from './utils';


// main declaration of modules being altered by the plugin
const [
   Clipboard,
   LazyActionSheet,
   ChannelStore,
   MessageStore,
   FluxDispatcher
] = bulk(
   filters.byProps('setString'),
   filters.byProps("openLazy", "hideActionSheet"),
   filters.byProps("getChannel", "getDMFromUserId"),
   filters.byProps("getMessage", "getMessages"),
   filters.byProps("_currentDispatchActionType", "_subscriptions", "_actionHandlers", "_waitQueue")
);


// initialization
const Patcher = create('dislate');

const Dislate: Plugin = {
   ...manifest,

   onStart() {
      let attempt = 0;
      let attempts = 3;
      const unpatchActionSheet = () => {
            try {
               attempt++;
               let masterDisableBool = getBoolean("Dislate", "masterDisable", false)
               let enableToasts = getBoolean("Dislate", "toastEnable", false)

               if (masterDisableBool) {
                  console.log("[Dislate] Plugin is force disabled from Settings.")
                  return;
               }

               // wake up flux message update
               for (const handler of ["MESSAGE_UPDATE"]) {
                  try {
                     FluxDispatcher.dispatch({
                           type: handler,
                           message: {},
                        });
                  } catch(err) { console.log(`[Dislate Local Error ${err}]`);}
               }

               console.log(`[Dislate] delayed start attempt ${attempt}/${attempts}.`);

               enableToasts?Toasts.open({
                    content: `[Dislate] start attempt ${attempt}/${attempts}.`,
                    source: getIDByName('debug'),
               }):console.log("[Dislate] Init Toasts are disabled.")
            
               // main patch
               Patcher.before(LazyActionSheet, "openLazy", (_, [component, sheet], _res) => {
                  if (sheet === "MessageLongPressActionSheet") {
                     component.then((instance) => {
                        Patcher.after(instance, "default", (_, message, res) => {
                           // returns if theres no props on res
                           if (!res.props) {
                              console.log(`[Dislate Local Error: Property "Props" Does not Exist on "res"]`)
                              return res;
                           }

                           const finalLocation = res?.props?.children?.props?.children?.props?.children[1]
                           // doesnt place a new element if its already there
                           if (
                              finalLocation[0].key == "1002"
                           ) {
                              return;
                           }

                           // gets original message sent by user
                           const originalMessage = MessageStore.getMessage(
                              message[0].message.channel_id,
                              message[0].message.id
                           );
                           
                           // return if theres no content
                           if (!message[0].message.content) return;

                           
                           // returns if the timestamp is invalid
                           try {
                              if (!message[0].edited_timestamp._isValid) return;
                           } catch { }

                           // adds new element to the top of lazyActionSheet array
                           finalLocation.unshift(
                              <FormRow
                                 key={`1002`} // for no new items every time
                                 label='Translate'
                                 leading={<FormRow.Icon source={getIDByName('img_nitro_star')} />}
                                 onPress={() => {
                                    try{
                                       if (
                                          !originalMessage?.editedTimestamp ||
                                          originalMessage?.editedTimestamp._isValid
                                       ) {
                                          // translates message into language from settings
                                          translateString(
                                             originalMessage.content, 
                                             get("Dislate", "DislateLangFrom", "detect"), 
                                             get("Dislate", "DislateLangTo", "japanese")
                                          ).then(res => {
                                             // updates the message clicked with the new content and language translated to
                                             const editEvent = {
                                                type: "MESSAGE_UPDATE",
                                                message: {
                                                   ...originalMessage,
                                                   edited_timestamp: "invalid_timestamp",
                                                   content:
                                                         `${res} \`[${formatString(get("Dislate", "DislateLangTo", "japanese"))}]\``,
                                                   guild_id: ChannelStore.getChannel(
                                                         originalMessage.channel_id
                                                   ).guild_id,
                                                },
                                                log_edit: false
                                             };
                                             // dispatches the event
                                             FluxDispatcher.dispatch(editEvent);

                                             // opens a toast to declare success
                                             Toasts.open({ 
                                                content: `Modified message to ${formatString(get("Dislate", "DislateLangTo", "japanese"))}.`, 
                                                source: getIDByName('img_nitro_star')
                                             })
                                          })
                                          
                                       }
                                       // hides the action sheet
                                       LazyActionSheet.hideActionSheet()
                                    } catch(err) { console.log(`[Dislate Local Error ${err}]`);}
                                    
                                 }} />
                           );
                        })
                     });
                  }
               })
            } catch(err) {
               console.log(`[Dislate Local Error ${err}]`);
               let enableToasts = getBoolean("Dislate", "toastEnable", false)

                if (attempt < attempts) {
                    console.warn(
                        `[Dislate] failed to start. Trying again in ${attempt}0s.`
                    );
                    enableToasts?
                    Toasts.open({
                        content: `[Dislate] failed to start trying again in ${attempt}0s.`,
                        source: getIDByName('ic_message_retry'),
                    }):console.log("[Dislate] Init toasts are disabled.")
                    setTimeout(unpatchActionSheet, attempt * 10000);
                } else {
                    console.error(`[Dislate] failed to start. Giving up.`);
                    enableToasts?
                    Toasts.open({
                        content: `[Dislate] failed to start. Giving up.`,
                        source: getIDByName('Small'),
                    }):console.log("[Dislate] Init toasts are disabled.")
                }
            }
      }

      setTimeout(() => {
         unpatchActionSheet();
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