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
      Patcher.before(LazyActionSheet, 'openLazy', (_, [component, sheet, message], res) => {
         if (sheet !== 'MessageLongPressActionSheet') return res;
         let channelId = getLastSelectedChannelId.getChannelId();

         alert(channelId)

         // setting booleans for toggling buttons
         let masterDisableBool = getBoolean("AccountInfo", "masterDisable", false)

         component.then(instance => {
            Patcher.instead(instance, 'default', (self, message, orig) => {
                  res.type.render = (...args) => {
                     const res = orig.apply(self, args);
                     const wrapper = findInTree(res, r => r.type?.render?.name === 'Wrapper', { walkable: ['props', 'type', 'children'] });
                     if (!wrapper) return res;
                     wrapper.type.render = (...args) => {
                        const res = orig.apply(self, args);
                        if (!res) return;
                        const children = findInReactTree(res, r => r.find?.(c => Array.isArray(c)));
                        if (!children || !children[1]) return res;
                        const items = children[1];
                        items.unshift(<FormRow
                           label='Translate'
                           leading={<FormRow.Icon source={getIDByName('img_nitro_star')} />}
                           onPress={() => {
                              let channelId = getLastSelectedChannelId.getChannelId();
                              let content = message[0].message.content
                              alert(`${channelId}
${content}`)
                              LazyActionSheet.hideActionSheet();
                           }} />
                        );
                     return res;
                  };
                  return res;
               };
            })
         })
      });
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