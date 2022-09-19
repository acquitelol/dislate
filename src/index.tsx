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
   getLastSelectedChannelId
] = bulk(
   filters.byProps('setString'),
   filters.byProps("openLazy", "hideActionSheet"),
   filters.byProps("getLastSelectedChannelId")
);

// initialization
const Patcher = create('dislate');

const Dislate: Plugin = {
   ...manifest,

   onStart() {
      Patcher.before(
         LazyActionSheet,
         "openLazy",
         (_, [component, sheet], res) => {
            const [channelId, setChannelId] = React.useState()
            const [messageContent, setMessageContent] = React.useState()

            if (sheet === "MessageLongPressActionSheet") {
               component.then((instance) => {
                  Patcher.after(instance, "default", (_, message, res) => {
                     setChannelId(message["0"]["message"]["channel_id"])
                     setMessageContent(message["0"]["message"]["content"])
                     
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
                                 console.log(messageContent)
                                 LazyActionSheet.hideActionSheet()
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