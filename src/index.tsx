// main imports of elements and dependencies
import { Constants, React, StyleSheet } from 'enmity/metro/common';
import { FormDivider, FormRow, Text, View} from 'enmity/components';
import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import { getIDByName } from 'enmity/api/assets';
import { bulk, filters, getByProps } from 'enmity/metro';
import { create } from 'enmity/patcher';
import manifest from '../manifest.json';
import Settings from './components/Settings';
import { getBoolean, set, toggle } from 'enmity/api/settings'
import { findInReactTree, findInTree } from 'enmity/utilities'

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
            } catch (err) {
               console.log('[Dislate Dispatch Error]', err);
            }
         }
      
         Patcher.before(
            LazyActionSheet,
            "openLazy",
            (_, [component, sheet], res) => {
               
               if (sheet === "MessageLongPressActionSheet") {
                  component.then((instance) => {
                     Patcher.after(instance, "default", (_, message, res) => {
                        const originalMessage = MessageStore.getMessage(
                           message[0].message.channelId,
                           message[0].message.id
                        );

                        const origRender = res.type.render;
                        res.type.render = function (...args) {
                           const res = origRender.apply(this, args);
                           const wrapper = findInTree(res, r => r.type?.render?.name === 'Wrapper', { walkable: ['props', 'type', 'children'] });
                           if (!wrapper) return res;

                           const origWrapper = wrapper.type.render;
                           wrapper.type.render = function (...args) {
                              const res = origWrapper.apply(this, args);
                              if (!res) return;

                              const children = findInReactTree(res, r => r.find?.(c => Array.isArray(c)));
                              if (!children || !children[1]) return res;

                              const items = children[1];
                              items.unshift(<FormRow
                                 label='Translate'
                                 leading={<FormRow.Icon source={getIDByName('img_nitro_star')} />}
                                 onPress={() => {
                                    // if (
                                    //    !originalMessage?.editedTimestamp ||
                                    //    originalMessage?.editedTimestamp._isValid
                                    // ) {
                                    //    try{
                                    //       var origContent = originalMessage.content
                                    //       var origChannel = originalMessage.channel_id
                                    //    }catch{
                                    //       var origContent = message[0].message.content
                                    //       var origChannel = message[0].message.channel_id
                                    //    }
                                    //    message[0] = {};
                                    //    const editEvent = {
                                    //       type: "MESSAGE_UPDATE",
                                    //       message: {
                                    //          ...originalMessage,
                                    //          edited_timestamp: "invalid_timestamp",
                                    //          content:
                                    //                origContent + ` \`[edited by ${manifest.authors[0].name}]\``,
                                    //          guild_id: ChannelStore.getChannel(
                                    //                origChannel
                                    //          ).guild_id,
                                    //       },
                                    //       log_edit: false
                                    //    };
                                    //    FluxDispatcher.dispatch(editEvent);
                                    // }

                                    console.log(originalMessage)
                                    LazyActionSheet.hideActionSheet()
                                    items.shift()
                                 }} />
                              );
                              return res;
                           };
                        return res;
                     };
                  });
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