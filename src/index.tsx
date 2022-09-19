// main imports of elements and dependencies
import { Constants, React, StyleSheet } from 'enmity/metro/common';
import { FormDivider, FormRow, Text, View} from 'enmity/components';
import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import { getIDByName } from 'enmity/api/assets';
import { bulk, filters, getByProps } from 'enmity/metro';
import { create } from 'enmity/patcher';
import manifest from '../manifest.json';
import Settings from './components/Settings';
import { get, set } from 'enmity/api/settings'
import translate from "translate";


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
      const unpatchActionSheet = () => {

         for (const handler of ["MESSAGE_UPDATE", "MESSAGE_DELETE"]) {
            try {
               FluxDispatcher.dispatch({
                     type: handler,
                     message: {}, // should be enough to wake them up
                  });
            } catch(err) { console.log(`[Dislate Local Error ${err}]`);}
         }
      
         Patcher.before(LazyActionSheet, "openLazy", (_, [component, sheet], _res) => {
            if (sheet === "MessageLongPressActionSheet") {
               component.then((instance) => {
                  Patcher.after(instance, "default", (_, message, res) => {
                     if (
                        res.props.children.props.children.props.children[1][0].key == "1002"
                     ) {
                        return;
                     }

                     const originalMessage = MessageStore.getMessage(
                        message[0].message.channel_id,
                        message[0].message.id
                     );
                     
                     if (!message[0]?.message?.content) return;

                     try {
                        if (!message[0].edited_timestamp._isValid) return;
                     } catch { }

                     res.props.children.props.children.props.children[1].unshift(
                        
                        <FormRow
                           key={`1002`}
                           label='Translate'
                           leading={<FormRow.Icon source={getIDByName('img_nitro_star')} />}
                           onPress={() => {
                              translate(originalMessage.content, { 
                                 to: get("Dislate", "DislateLangTo", "japanese"), 
                                 engine: get("Dislate", "DislateLangEngine", "deepl")})
                              .then(translatedText => {
                                 try{
                                    if (
                                       !originalMessage?.editedTimestamp ||
                                       originalMessage?.editedTimestamp._isValid
                                    ) {
                                       
                                       const editEvent = {
                                          type: "MESSAGE_UPDATE",
                                          message: {
                                             ...originalMessage,
                                             edited_timestamp: "invalid_timestamp",
                                             content:
                                                   `${translatedText} \`[Language: ${get("Dislate", "DislateLangTo", "japanese")}]\``,
                                             guild_id: ChannelStore.getChannel(
                                                   originalMessage.channel_id
                                             ).guild_id,
                                          },
                                          log_edit: false
                                       };
                                       FluxDispatcher.dispatch(editEvent);
                                    }

                                    LazyActionSheet.hideActionSheet()
                                 } catch(err) { console.log(`[Dislate Local Error ${err}]`);}
                              })
                           }} />
                     );
                  })
               });
            }
         })
      }
      setTimeout(() => {
         unpatchActionSheet();
      }, 300); // give Flux some time to initialize -- 300ms should be more than enough
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