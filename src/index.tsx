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
           if (sheet === "MessageLongPressActionSheet") {
             component.then((instance) => {
               Patcher.after(instance, "default", (_, args, res) => {
                  if(res.props.children().props.children.props.children[1][0].key == "696") {
                     return
                  }
                  const children = findInReactTree(res, r => r.find?.(c => Array.isArray(c)));
                  if (!children || !children[1]) return res;
                  const items = children[1];

                  items.unshift(
                     <FormRow
                        key="696"
                        leading={<FormRow.Icon source={getIDByName('img_nitro_star')} />}
                        label="Translate"
                        onPress={() => {
                           console.log(`${((args[0])["message"])["content"]}`)
                           LazyActionSheet.hideActionSheet();
                        }}
                     />
                  );
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