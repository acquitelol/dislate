/**
 * Imports
 * @param {get, set}: Allows you to retrieve and store settings into the plugin file.
 * @param {FormDivider, FormRow, FormSection, FormSwitch}: Components which are part of a form to allow you to create setting UIs.
 * @param Text: Allows you to render custom, styled Text.
 * @param {bulk, filters}: Allows you to get modules from Discord in bulk declarations.
 * @param React: This is used to run proprietary functions such as @arg React.useState or @arg React.useEffect
 * @param Constants: Used to get variables from Discord which are always the same constant name but might change based on theme etc.
 * @param Navigation: Allows you to push and pop @arg pages from the Navigation Stack.
 * @param Storage: Allows you to 
 */
import { get, set } from 'enmity/api/settings';
import { FormDivider, FormRow, FormSection, FormSwitch, Text } from 'enmity/components';
import { bulk, filters } from 'enmity/metro';
import { React, Constants, Navigation, Storage, StyleSheet, Toasts } from 'enmity/metro/common';
import { clipboard_toast, debug_info, fetch_debug_arguments, format_string, for_item, Icons } from '../utils';
import { check_for_updates } from '../utils/update';
import Credits from './Credits';
import ExitWrapper from './ExitWrapper';
import Languages from './Languages';
import Page from './Page';

/** 
 * Main modules being fetched by the plugin to open links externally and copy text to clipboard
 * @param Router: This is used to open a url externally with @arg Router.openURL ~
 * @param Clipboard: This is used to copy any string to clipboard with @arg Clipboard.setString ~
 */
 const [
    Router,
    Clipboard,
 ] = bulk(
    filters.byProps('transitionToGuild'),
    filters.byProps('setString'),
 );

 /**
  * Main Settings Page for Dislate.
  * This page takes settings and a manifest to prevent having to re-import it again in this file.
  * @param settings: The main prop of available methods to use for settings.
  * @param manifest: Prop to fetch the strings from @arg manifest.json to prevent needing to import them inside of this file
        * @param name: The name of the plugin. In this case, its Dislate.
        * @param version: The version of the plugin.
        * @param plugin: Different constant values such as a raw plugin source etc.
        * @param authors: List of authors with their Discord ID and a link to their GitHub profile.
        * @param release: The current release channel of the plugin. This is generally a toggle between @arg stable and @arg development
  */
export default ({ settings, manifest: { name, version, plugin, authors, release } }) => {
    /**
     * @param styles: The main stylesheet for the items in the UI.
     */
    const styles = StyleSheet.createThemedStyleSheet({
        /**
         * @param icon: Global style for icons to give them a neutral color scheme and ensure they fit together well.
         */
        icon: {
            color: Constants.ThemeColorMap.INTERACTIVE_NORMAL
        },
        /**
         * @param item: Style for trailing text to give it the Muted color, and contrast the normal colour of the text.
         */
        item: {
            color: Constants.ThemeColorMap.TEXT_MUTED
        }
    });

    /**
     * Main component render
     * @renders {(@arg {fragmented} component)}
     */
    return <>
        {/**
         * This component was wrapped in a @arg ExitWrapper to allow you to exit the page by swiping to the right.
         * @param Component: The main component to render inside of the @arg ExitWrapper
         */}
        <ExitWrapper Component={<>
            {/**
             * The main credits component, to render information about the project in a form factor which is pleasing to the eyes.
             * @param Credits: The main credits component.
             */}
            <Credits 
                name={name}
                version={version}
                plugin={plugin}
                authors={authors}
            /> 
            {/**
             * The main "language section" of the settings panel. This section is where the user can control:
                    * @arg {language to translate from}
                    * @arg {language to translate to}
                    * @arg {whether to abbreviate the language label} 
             */}
            <FormSection title="Language">
                {/**
                 * The main component to allow the user to open a page and choose what language they would like to translate from.
                 * @param Icons.Settings.Translate_From: The main icon for the translate "from" component.
                 */}
                <FormRow
                    label='Translate From'
                    leading={<FormRow.Icon style={styles.icon} source={Icons.Settings.Translate_From} />}
                    trailing={() => <Text style={styles.item}>
                            {/**
                             * Renders the language that the user current selected. If the setting call returns undefined, use N/A
                             */}
                            {format_string(get(name, "DislateLangFrom", "detect")) ?? "N/A"}
                        </Text>}
                    onPress={()=>{
                        /**
                         * Sets the language filter to either true or false. 
                         * This controls multiple things, such as whether to render the @arg Detect option and whether to set the language as @arg to or @arg from when the user has clicked on an option
                         * This is because it renders the same component for both @arg to and @arg from
                         * 
                         * As this is false, the @arg Detect option @arg will appear, and when the user clicks on an option it will set it as the @arg from language.
                         */
                        set(name, "DislateLangFilter", false)
                        
                        /**
                         * Finally, push the @arg Languages page out to the user, using the @arg NavigationStack, and allow them to pick the @arg from language.
                         */
                        Navigation.push(Page, { component: Languages, name: `${name}: Language From` })
                    }}
                />
                <FormDivider/>
                {/**
                 * The main component to allow the user to open a page and choose what language they would like to translate to.
                 * @param Icons.Settings.Translate_To: The main icon for the translate "to" component.
                 */}
                <FormRow
                    label='Translate To'
                    leading={<FormRow.Icon style={styles.icon} source={Icons.Settings.Translate_To} />}
                    trailing={() => <Text style={styles.item}>
                            {/**
                                 * Renders the language that the user current selected. If the setting call returns undefined, use N/A
                                 */}
                            {format_string(get(name, "DislateLangTo", "english")) ?? "N/A"}
                        </Text>}
                    onPress={()=>{
                        /**
                         * Sets the language filter to either true or false. 
                         * This controls multiple things, such as whether to render the @arg Detect option and whether to set the language as @arg to or @arg from when the user has clicked on an option
                         * This is because it renders the same component for both @arg to and @arg from
                         * 
                         * As this is true, the @arg Detect option @arg won't appear, and when the user clicks on an option it will set it as the @arg to language.
                         */
                        set(name, "DislateLangFilter", true)

                        /**
                         * Finally, push the @arg Languages page out to the user, using the @arg NavigationStack, and allow them to pick the @arg to language.
                         */
                        Navigation.push(Page, { component: Languages, name: `${name}: Language To` })
                    }}
                />
                <FormDivider/>
                {/**
                 * This option allows you to label languages in a @arg shorter form when you translate another user's message
                 * For example, let's say that you translate a message from @arg Japanese to @arg English
                 * The original method would render it as @arg {ロージーは本当に背が高い} -> @arg {rosie is really tall [English]}
                 * The abbreviated method will render it as @arg {ロージーは本当に背が高い} -> @arg {rosie is really tall [EN]}
                 * 
                 * It is very minor customizability but allows more control from the user. This option only sets the setting, the main code controls what is displayed.
                 * @param Icons.Retry: The main @arg retry icon.
                 * @param Icons.Settings.Toasts.Settings: The main @arg tick icon.
                 */}
                <FormRow
                    label='Abbreviate Language'
                    leading={<FormRow.Icon style={styles.icon} source={Icons.Retry} />}
                    subLabel={`Label language in a shorter form (English ➝ EN)`}
                    trailing={
                        <FormSwitch
                            /**
                             * @param value: The current value of the switch. By default, in this option, it's set to false.
                             */
                            value={settings.getBoolean('DislateLangAbbr', false)}

                            /**
                             * @param onValueChange: The main callback to run when you tap on the switch to change the value of the toggle.
                             */
                            onValueChange={() => {
                                    /**
                                     * Invert the current value of the Language Abbreviation Setting
                                     * @param settings.toggle: Toggles a setting (@arg true -> @arg false)
                                     */
                                    settings.toggle('DislateLangAbbr', false)

                                    /**
                                     * Open a @arg Toast displaying to the user that the Language Abbreviation option has been @arg enabled or @arg disabled.
                                     * @param Icons.Settings.Toasts.Settings: The tick state of a toast from the Icons package.
                                     */
                                    Toasts.open({ 
                                        content: `Successfully ${settings.getBoolean('DislateLangAbbr', false) ? 'enabled' : 'disabled'} Language Abbreviations.`, 
                                        source: Icons.Settings.Toasts.Settings 
                                    });
                                }
                            }
                        />
                    }
                />
            </FormSection>
            {/**
             * The main "utility section" of the settings panel. This section is where the user can:
                    * @arg {control whether to display toasts when dislate is starting}
                    * @arg {copy full debug log to clipboard}
                    * @arg {clear any stores of data that might have been saved throughout plugin lifetime} 
             */}
            <FormSection title="Utility">
                {/**
                 * The main initliasation toast toggle. This would control whether you would like toasts to appear at the runtime of Dislate, and if any errors are caught.
                 * @param Icons.Settings.Initial: The @arg {toast} initialisation icon.
                 * @param Icons.Settings.Toasts.Settings: The @arg tick icon.
                 */}
                <FormRow
                    label='Initialisation Toasts'
                    leading={<FormRow.Icon style={styles.icon} source={Icons.Settings.Initial} />}
                    subLabel={`Toogle initialisation state of ${name}.`}
                    trailing={
                        <FormSwitch
                            /**
                             * @param value: The current value of the switch. By default, in this option, it's set to false.
                             */
                            value={settings.getBoolean('toastEnable', false)}

                            /**
                             * @param onValueChange: The main callback to run when you tap on the switch to change the value of the toggle.
                             */
                            onValueChange={() => {
                                    /**
                                     * Invert the current value of the Toast Initialisation Setting.
                                     * @param settings.toggle: Toggles a setting (@arg true -> @arg false)
                                     */
                                    settings.toggle('toastEnable', false)

                                    /**
                                     * Open a @arg Toast displaying to the user that the Language Abbreviation option has been @arg enabled or @arg disabled.
                                     * @param Icons.Settings.Toasts.Settings: The tick state of a toast from the Icons package.
                                     */
                                    Toasts.open({ 
                                        content: `Successfully ${settings.getBoolean('toastEnable', false) ? 'enabled' : 'disabled'} Load Toasts.`, 
                                        source: Icons.Settings.Toasts.Settings 
                                    });
                                }
                            }
                        />
                    }
                />
                <FormDivider />
                {/**
                 * The main debug info log. This would allow the user to copy the entire debug log to clipboard. Of course, they could use the </dislate type:Debug :1> command to choose, but this copies the full log.
                 * @param Icons.Copy: The @arg toast initialisation icon.
                 * @param Icons.Settings.Toasts.Settings: The @arg tick icon.
                 */}
                <FormRow
                    label='Copy Debug Info'
                    subLabel={`Copy useful debug information of ${name} to clipboard.`}
                    leading={<FormRow.Icon style={styles.icon} source={Icons.Copy} />}
                    trailing={FormRow.Arrow}
                    onPress={ async function() {
                        /**
                         * Fetch the full list of @arg {debug} arguments. This is asynchronous because it needs to fetch the device as an async string from storage.
                         * @param options: The full list of available debug arguments
                         */
                        const options = await fetch_debug_arguments()

                        /**
                         * Set the full list of arguments wrapped in a @arg {debug} info function to format the message in a way that you can paste into Discord.
                         */
                        Clipboard.setString(await debug_info(Object.keys(options)));

                        /**
                         * Finally, show a toast informing the user that the debug information text has been copied to clipboard.
                         */
                        clipboard_toast('debug information')
                    }}
                />
                <FormDivider />
                {/**
                 * The main clear state store button. This would allow the user to clear any state from the custom dialog implementations, clear their device list, and clear their agreement to the incompatible device notice.
                 * @param Icons.Delete: The main @arg delete icon.
                 * @param Icons.Settings.Toasts.Settings: The @arg tick icon.
                 */}
                <FormRow
                    label='Clear Stores'
                    subLabel={`Void most of the stores used throughout ${name}.`}
                    leading={<FormRow.Icon style={styles.icon} source={Icons.Delete} />}
                    trailing={FormRow.Arrow}
                    onPress={async function() {
                        /**
                         * Fetch any existing stored state inside of the @arg dislate_store_state array.
                         * @param store_items: List of existing items in array form containing objects with name and type.
                         */
                        const store_items: any = JSON.parse(await Storage.getItem("dislate_store_state")) ?? []

                        /**
                         * Loop through the stored items with a custom implementation of a forEach to allow for labels.
                         * @param store_items: List of items to clear the store of, which were explicitly set with the store_item.ts file.
                         */
                        for_item(store_items, async function(item: any) {
                            /**
                             * Either removes the item or sets it to false depending on whether the item type is storage or not
                             * @if {(@arg item.type) is equal to @arg {string} storage} -> Remove the item's name from storage.
                             * @else {()} -> Set the item name to false as a setting.
                             */
                            item.type==='storage'
                                ? await Storage.removeItem(item.name)
                                : set(name, item.name, false)
                        }, 'clearing state store')

                        /**
                         * Remove the store to ensure it doesnt get cleared twice.
                         */
                        await Storage.removeItem('dislate_store_state')

                        /**
                         * Finally, open a @arg Toast to notify the user that all of the stores have been cleared.
                         */
                        Toasts.open({ 
                            content: `Cleared all ${name} stores.`, 
                            source: Icons.Settings.Toasts.Settings 
                        });
                    }}
                />
            </FormSection>
            {/**
             * The main "source section" of the settings panel. This section is where the user can:
                    * @arg {check for updates}
                    * @arg {open the repo of the plugin}
             */}
            <FormSection title="Source">
                {/**
                 * The main update button. This would allow the user to search the github for the latest release and check if it is the current release installed, and prompts the user to update if it isnt.
                 * @param Icons.Settings.Update: The main @arg update icon.
                 */}
                <FormRow
                    label="Check for Updates"
                    subLabel={`Search for any ${name} version and build updates.`}
                    leading={<FormRow.Icon style={styles.icon} source={Icons.Settings.Update} />}
                    trailing={FormRow.Arrow}
                    onPress={ async function() {
                        /**
                         * Simply calls the @func check_for_updates function asynchronously. This is a whole seperate documented script located at src/utils/update.ts 
                         * This would check for any updates to the version or build and prompt the user to update if any are found.
                         */
                        await check_for_updates();
                    }}
                />
                <FormDivider />
                {/**
                * The main repository. This would allow the user to open an external window inside of Discord using Router and display the current dislate repo, on GitHub.
                * @param Icons.Open: The main @arg {external} open icon.
                */}
                <FormRow
                    label="Source"
                    subLabel={`Open the repository of ${name} externally.`}
                    leading={<FormRow.Icon style={styles.icon} source={Icons.Open} />}
                    trailing={FormRow.Arrow}
                    onPress={() => {
                        /**
                         * Simply opens the plugin repository externally to the user using the Router.
                         * @param plugin.repo: The blob link of the plugin.
                         */
                        Router.openURL(plugin.repo)
                    }}
                />
            </FormSection>
            {/**
             * Renders a simple FormRow with a version and build to display to the user. This is unnecessary as there as multiple ways to view this but 
             */}
            <FormRow label={`Build: (${(plugin.build).split('-')[1]}) Release: (${release})`} /> 
        </>} />
   </>
};