/**
 * Imports
 * @param { get, set }: Allows you to retrieve and store settings into the plugin file.
 * @param { FormDivider, FormRow, FormSwitch }: Components which are part of a form to allow you to create setting UIs.
 * @param Text: Allows you to render custom, styled Text.
 * @param { bulk, filters }: Allows you to get modules from Discord in bulk declarations.
 * @param React: This is used to run proprietary functions such as @arg React.useState or @arg React.useEffect
 * @param Constants: Used to get variables from Discord which are always the same constant name but might change based on theme etc.
 * @param Navigation: Allows you to push and pop @arg pages from the Navigation Stack.
 * @param Storage: Allows you to store and retrieve Serializable items asynchronously.
 * @param StyleSheet: Allows you to create custom React Native stylesheets.
 * @param Toasts: Allows you to open a small notification.
 * @param {* from common}: Custom implementations and functions used throughout Dislate, stored away to abstract the source
 * @param Credits: The main Credits UI allowing for Name, Authors, etc
 * @param SectionWrapper: Allows you to split components into sections, similar to FormSection from Discord.
 * @param Languages: Page which allows you to choose a language
 * @param Page: Default Page which will render more TSX inside of it.
 */
import { get, getBoolean, set } from 'enmity/api/settings';
import { FormDivider, FormRow, FormSwitch, ScrollView, Text, View } from 'enmity/components';
import { bulk, filters } from 'enmity/metro';
import { React, Constants, Storage, StyleSheet, Toasts } from 'enmity/metro/common';
import { Miscellaneous, Format, ArrayImplementations as ArrayOps, Icons, Updater } from '../../common';
import Credits from './Credits';
import SectionWrapper from '../Wrappers/SectionWrapper'
import { Languages } from '../Pages';
import { renderActionSheet } from '../Modals/DebugInfoActionSheet';

/** 
 * Main modules being fetched by the plugin to open links externally and copy text to clipboard
 * @param Router: This is used to open a url externally with @arg Router.openURL ~
 * @param Clipboard: This is used to copy any string to clipboard with @arg Clipboard.setString ~
 * @param LazyActionSheet: The main module to open and close an ActionSheet with a given component.
 */
const [
    Router,
    Clipboard,
    LazyActionSheet
] = bulk(
    filters.byProps('transitionToGuild'),
    filters.byProps('setString'),
    filters.byProps("openLazy", "hideActionSheet")
);

/**
  * Main Settings Page for Dislate.
  * This page takes settings and a manifest to prevent having to re-import it again in this file.
  * @param {any} settings: The main prop of available methods to use for settings.
  * @param {object} manifest: Prop to fetch the strings from @arg manifest.json to prevent needing to import them inside of this file
        * @uses @param name: The name of the plugin. In this case, its Dislate.import { renderActionSheet } from '../Modals/DebugInfoActionSheet';

        * @uses @param version: The version of the plugin.
        * @uses @param plugin: Different constant values such as a raw plugin source etc.
        * @uses @param authors: List of authors with their Discord ID and a link to their GitHub profile.
        * @uses @param release: The current release channel of the plugin. This is generally a toggle between @arg stable and @arg development
  */
export default ({ settings, manifest: { name, version, plugin, authors, release }, Navigator, languages }) => {
    /**
     * @param {StyleSheet} styles: The main stylesheet for the items in the UI.
     */
    const styles = StyleSheet.createThemedStyleSheet({
        /**
         * @param {object} icon: Global style for icons to give them a neutral color scheme and ensure they fit together well.
         */
        icon: {
            color: Constants.ThemeColorMap.INTERACTIVE_NORMAL
        },
        /**
         * @param {object} item: Style for trailing text to give it the Muted color, and contrast the normal colour of the text.
         */
        item: {
            color: Constants.ThemeColorMap.TEXT_MUTED,
            fontFamily: Constants.Fonts.PRIMARY_MEDIUM
        },
        /**
         * @param {object} container: Main style for a rounded container for creating custom FormSection implementations.
         */
        container: {
            width: '90%',
            marginLeft: '5%',
            borderRadius: 10,
            backgroundColor: Constants.ThemeColorMap.BACKGROUND_MOBILE_SECONDARY,
            ...Miscellaneous.shadow() /** @param shadow: Main shadow implementation */
        },
        /**
         * @param {object} subheaderText: Main styling for the text right at the bottom of the settings page, showing build and release channel.
         */
        subheaderText: {
            color: Constants.ThemeColorMap.HEADER_SECONDARY,
            textAlign: 'center',
            margin: 10,
            marginBottom: 50,
            letterSpacing: 0.25,
            fontFamily: Constants.Fonts.PRIMARY_BOLD,
            fontSize: 14
        }
    });

    const navigation = Navigator.useNavigation();

    /**
     * Main component render
     * @renders {(@arg {fragmented} component)}
     */
    return <ScrollView>
        {/**
         * The main credits component, to render information about the project in a form factor which is pleasing to the eyes.
         * @param Credits: The main credits component.
         * 
         * @uses @param name
         * @uses @param version
         * @uses @param plugin 
         * @uses @param authors
         */}
        <Credits 
            name={name}
            version={version}
            plugin={plugin}
            authors={authors}
        /> 
        <View style={{marginTop: 20}}>
            {/**
             * The main "language section" of the settings panel. This section is where the user can control:
                    * @arg {language to translate from}
                    * @arg {language to translate to}
                    * @arg {whether to abbreviate the language label} 
                    * @arg {whether to send only translated text or both originala and translated text}
                * This @uses an @arg SectionWrapper which works similar to an @arg FormSection but allows you to render any styling.
            */}
            <SectionWrapper label='Language' component={<>
                {/**
                 * The main section of available options to be selected by the User.
                 */}
                <View style={styles.container}>
                    {/**
                     * The main component to allow the user to open a page and choose what language they would like to translate from.
                     * @uses @param {number} Icons.Settings.TranslateFrom: The main icon for the translate "from" component.
                     */}
                    <FormRow
                        label='Translate From'
                        leading={<FormRow.Icon style={styles.icon} source={Icons.Settings.TranslateFrom} />}
                        trailing={() => <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text adjustsFontSizeToFit={true} style={styles.item}>
                                {/**
                                 * Renders the language that the user current selected. If the setting call returns undefined, use N/A
                                 */}
                                {Format.string(get(name, "DislateLangFrom", "detect") as string) ?? "N/A"}
                            </Text>
                            <FormRow.Arrow />
                        </View>}
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
                             * Finally, push the @arg Languages page out to the user, using @arg Navigator.useNavigation.navigate, and allow them to pick the @arg from language.
                             */
                            navigation.push("EnmityCustomPage", {
                                navigation,
                                pageName: `Translate ${getBoolean(name, "DislateLangFilter", true) ? "To" : "From"}`,
                                pagePanel: (): any => <Languages languages={languages} Navigator={Navigator} />
                            })
                        }}
                        onLongPress={() => Miscellaneous.displayToast('Open a new page allowing you to choose a language that you can translate from. The default is "Detect".', 'tooltip')}
                    />
                    <FormDivider/>
                    {/**
                     * The main component to allow the user to open a page and choose what language they would like to translate to.
                     * @uses @param {number} Icons.Settings.TranslateTo: The main icon for the translate "to" component.
                     */}
                    <FormRow
                        label='Translate To'
                        leading={<FormRow.Icon style={styles.icon} source={Icons.Settings.TranslateTo} />}
                        trailing={() => <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text adjustsFontSizeToFit={true} style={styles.item}>
                                {/**
                                 * Renders the language that the user current selected. If the setting call returns undefined, use N/A
                                 */}
                                {Format.string(get(name, "DislateLangTo", "english") as string)}
                            </Text>
                            <FormRow.Arrow />
                        </View>}
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
                             * Finally, push the @arg Languages page out to the user, using @arg Navigator.useNavigation.navigate, and allow them to pick the @arg to language.
                             */
                            navigation.push("EnmityCustomPage", {
                                navigation, 
                                pageName: `Translate ${getBoolean(name, "DislateLangFilter", true) ? "To" : "From"}`,
                                pagePanel: (): any => <Languages languages={languages} Navigator={Navigator} />
                            })
                        }}
                        onLongPress={() => Miscellaneous.displayToast('Open a new page allowing you to choose a language that you can translate to. The default is "English".', 'tooltip')}
                    />
                    <FormDivider/>
                    {/**
                     * This option allows you to label languages in an @arg shorter form when you translate another user's message
                     * For example, let's say that you translate a message from @arg Japanese to @arg English
                     * The original method would render it as @arg {ロージーは本当に背が高い} -> @arg {rosie is really tall [English]}
                     * The abbreviated method will render it as @arg {ロージーは本当に背が高い} -> @arg {rosie is really tall [EN]}
                     * 
                     * It is a very minor customizability but allows more control from the user. Furthermore, this option only sets the setting, the main code controls what is displayed through fetching its current state.
                     * @uses @param {number} Icons.Retry: The main @arg retry icon.
                     * @uses @param {number} Icons.Settings.Toasts.Settings: The main @arg tick icon.
                     */}
                    <FormRow
                        label='Abbreviate Language'
                        leading={<FormRow.Icon style={styles.icon} source={Icons.Retry} />}
                        subLabel={`Label language in a shorter form when translating (English ➝ EN).`}
                        onLongPress={() => Miscellaneous.displayToast('Convert the full language name to an abbreviation when translating someone else\'s message. (test [English] ➝ test [EN])', 'tooltip')}
                        trailing={
                            <FormSwitch
                                /**
                                 * @param {boolean} value: The current value of the switch. By default, in this option, it's set to false.
                                 */
                                value={settings.getBoolean('DislateLangAbbr', false)}

                                /**
                                 * @param {callback} onValueChange: The main callback to run when you tap on the switch to change the value of the toggle.
                                 */
                                onValueChange={() => {
                                        /**
                                         * Invert the current value of the Language Abbreviation Setting
                                         * @uses @param settings.toggle: Toggles a setting (@arg true -> @arg false)
                                         */
                                        settings.toggle('DislateLangAbbr', false)

                                        /**
                                         * Open an @arg Toast displaying to the user that the Language Abbreviation option has been @arg enabled or @arg disabled.
                                         * @uses @param {number} Icons.Settings.Toasts.Settings: The tick state of a toast from the Icons package.
                                         */
                                        Toasts.open({ 
                                            content: `Successfully ${settings.getBoolean('DislateLangAbbr', false) ? 'enabled' : 'disabled'} language abbreviations.`, 
                                            source: Icons.Settings.Toasts.Settings 
                                        });
                                    }
                                }
                            />
                        }
                    />
                    <FormDivider/>
                    {/**
                     * This option allows you to send both the original and translated message when using @arg {/translate}
                     * For example, let's say that you send a translated message with content @arg {rosie is really tall}
                     * With this option disabled, this would be rendered as @arg {ロージーは本当に背が高い}
                     * With this option enabled, this would be rendered as @arg {
                                                                                * rosie is really tall
                                                                                * 
                                                                                * ロージーは本当に背が高い
                                                                                * }
                        * 
                        * @uses @param {number} Icons.Settings.Locale: The main @arg locale icon.
                        * @uses @param {number} Icons.Settings.Toasts.Settings: The main @arg tick icon.
                        */}
                    <FormRow
                        label='Send Original'
                        leading={<FormRow.Icon style={styles.icon} source={Icons.Settings.Locale} />}
                        subLabel={`Send both the Original and Translated message when using /translate.`}
                        onLongPress={() => Miscellaneous.displayToast('When using the /translate command, send both the original message and the translated message at once.', 'tooltip')}
                        trailing={
                            <FormSwitch
                                /**
                                 * @param {boolean} value: The current value of the switch. By default, in this option, it's set to false.
                                 */
                                value={settings.getBoolean('DislateBothLangToggle', false)}

                                /**
                                 * @param {callback} onValueChange: The main callback to run when you tap on the switch to change the value of the toggle.
                                 */
                                onValueChange={() => {
                                        /**
                                         * Invert the current value of the Send Original Setting
                                         * @uses @param settings.toggle: Toggles a setting (@arg true -> @arg false)
                                         */
                                        settings.toggle('DislateBothLangToggle', false)

                                        /**
                                         * Open an @arg Toast displaying to the user that the Send Original option has been @arg enabled or @arg disabled.
                                         * @uses @param {number} Icons.Settings.Toasts.Settings: The tick state of a toast from the Icons package.
                                         */
                                        Toasts.open({ 
                                            content: `Now sending ${settings.getBoolean('DislateBothLangToggle', false) ? 'original and translated' : 'only translated'} message.`, 
                                            source: Icons.Settings.Toasts.Settings 
                                        });
                                    }
                                }
                            />
                        }
                    />
                </View>
            </>} />
            {/**
             * The main "utility section" of the settings panel. This section is where the user can:
                    * @arg {control whether to display toasts when dislate is starting}
                    * @arg {copy full debug log to clipboard}
                    * @arg {clear any stores of data that might have been saved throughout plugin lifetime} 
                * This is wrapped in an @arg SectionWrapper which works similar to an @arg FormSection but allows you to render any styling.
            */}
            <SectionWrapper label='Utility' component={<>
                {/**
                 * The main section of available options to be selected by the User.
                 */}
                <View style={styles.container}>
                    {/**
                     * The main initliasation toast toggle. This would control whether you would like toasts to appear at the runtime of Dislate, and if any errors are caught.
                     * @uses @param {number} Icons.Settings.Initial: The @arg {toast} initialisation icon.
                     * @uses @param {number} Icons.Settings.Toasts.Settings: The @arg tick icon.
                     */}
                    <FormRow
                        label='Initialisation Toasts'
                        leading={<FormRow.Icon style={styles.icon} source={Icons.Settings.Initial} />}
                        subLabel={`Toggle initialisation toasts to display loading state of ${name}.`}
                        onLongPress={() => Miscellaneous.displayToast(`When Enmity is first started, show toasts based on ${name}'s current state (starting, failed, retrying, etc)`, 'tooltip')}
                        trailing={
                            <FormSwitch
                                /**
                                 * @param {boolean} value: The current value of the switch. By default, in this option, it's set to false.
                                 */
                                value={settings.getBoolean('toastEnable', false)}

                                /**
                                 * @param {callback} onValueChange: The main callback to run when you tap on the switch to change the value of the toggle.
                                 */
                                onValueChange={() => {
                                        /**
                                         * Invert the current value of the Toast Initialisation Setting.
                                         * @uses @param settings.toggle: Toggles a setting (@arg true -> @arg false)
                                         */
                                        settings.toggle('toastEnable', false)

                                        /**
                                         * Open an @arg Toast displaying to the user that the Language Abbreviation option has been @arg enabled or @arg disabled.
                                         * @uses @param {number} Icons.Settings.Toasts.Settings: The tick state of a toast from the Icons package.
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
                     * The main debug info log. This would allow the user to copy a part or the entire log to clipboard.
                     * @uses @param {number} Icons.Copy: The @arg toast initialisation icon.
                     * @uses @param {number} Icons.Settings.Toasts.Settings: The @arg tick icon.
                     */}
                    <FormRow
                        label='Open Debug Info'
                        subLabel={`Open useful page to copy debug information like version and build of ${name} to clipboard.`}
                        onLongPress={() => Miscellaneous.displayToast(`Copy the full debug log to clipboard including ${name}'s Version, Build, and Release, Enmity's Version and Build, etc.`, 'tooltip')}
                        leading={<FormRow.Icon style={styles.icon} source={Icons.Copy} />}
                        trailing={() => <FormRow.Arrow />}
                        onPress={() => {
                            /**
                             * Opens an @arg ActionSheet to the user and passes an onConfirm and type of @arg Copy because this is inside Settings, not the Command.
                             */
                            renderActionSheet((debugLog: string, type: string) => {
                                /**
                                 * This closes the current ActionSheet.
                                 * @param LazyActionSheet.hideActionSheet: Removes the top level action sheet.
                                 */
                                LazyActionSheet.hideActionSheet()
                
                                /**
                                 * Set the full list of arguments wrapped in an @arg {debug} info function to format the message in a way that you can paste into Discord.
                                 */
                                Clipboard.setString(debugLog);

                                /**
                                 * Finally, show an @arg Toast informing the user that the debug information text has been copied to clipboard.
                                 */
                                Miscellaneous.displayToast(`${type}`, 'clipboard')
                            }, "copy" /* The type being "copy" means that it'll display Copy for all the parts such as Copy Message etc. */)
                        }}
                    />
                    <FormDivider />
                    {/**
                     * The main clear state store button. This would allow the user to clear any state from the custom dialog implementations, clear their device list, and clear their agreement to the incompatible device notice.
                     * @uses @param {number} Icons.Delete: The main @arg delete icon.
                     * @uses @param {number} Icons.Settings.Toasts.Settings: The @arg tick icon.
                     */}
                    <FormRow
                        label='Clear Stores'
                        subLabel={`Void most of the settings and stores used throughout ${name} to store data locally.`}
                        onLongPress={() => Miscellaneous.displayToast(`Clear stores and settings throughout ${name} including the settings to hide popups forever and the list of device codes.`, 'tooltip')}
                        leading={<FormRow.Icon style={styles.icon} source={Icons.Delete} />}
                        trailing={() => <FormRow.Arrow />}
                        onPress={async function() {
                            /**
                             * Fetch any existing stored state inside of the @arg dislateStoreState array.
                             * @param {object} storeItems: List of existing items in array form containing objects with name and type.
                             */
                            const storeItems: any = JSON.parse(get(name, "state_store", null) as string) ?? []

                            /**
                             * Loop through the stored items with a custom implementation of a forEach to allow for labels.
                             * @uses @param {object} storeItems: List of items to clear the store of, which were explicitly set with the @arg store_item.ts file.
                             */
                            await ArrayOps.forItemAsync(storeItems, async function(item: any) {
                                /**
                                 * Either removes the item or sets it to false depending on whether the item type is storage or not
                                 * @if {(@arg item.type) is equal to @arg {string} storage} -> Remove the item's name from storage.
                                 * @else {()} -> Set the item name to @arg {override} value or @arg false as a setting.
                                 */
                                item.type==='storage'
                                    ? await Storage.removeItem(item.name)
                                    : set(name, item.name, item.override ?? false)
                            }, 'clearing state store')

                            /**
                             * Remove the store to ensure it doesnt get cleared twice.
                             */
                            set(name, "state_store", null);

                            /**
                             * Finally, open an @arg Toast to notify the user that all of the stores have been cleared.
                             */
                            Toasts.open({ 
                                content: `Cleared all ${name} stores.`, 
                                source: Icons.Settings.Toasts.Settings 
                            });
                        }}
                    />
                </View>
            </>} />
            {/**
             * The main "source section" of the settings panel. This section is where the user can:
                    * @arg {check for updates}
                    * @arg {open the repo of the plugin}
                * This is wrapped in an @arg SectionWrapper which works similar to an @arg FormSection but allows you to render any styling.
            */}
            <SectionWrapper label='Source' component={<>
                {/**
                 * The main section of available options to be selected by the User.
                 */}
                <View style={styles.container}>
                    {/**
                     * The main update button. This would allow the user to search the github for the latest release and check if it is the current release installed, and prompts the user to update if it isnt.
                     * @uses @param {number} Icons.Settings.Update: The main @arg update icon.
                     */}
                    <FormRow
                        label="Check for Updates"
                        subLabel={`Search for any ${name} updates and notify you if an update is available.`}
                        onLongPress={() => Miscellaneous.displayToast(`Search GitHub for any new version or build of ${name} and prompts you to update, and then prompts you to restart Enmity afterwards.`, 'tooltip')}
                        leading={<FormRow.Icon style={styles.icon} source={Icons.Settings.Update} />}
                        trailing={() => <FormRow.Arrow />}
                        onPress={ async function() {
                            /**
                             * Simply calls the @func Updater.checkForUpdates function asynchronously. This is a whole seperate documented script located at src/commmon/update.ts 
                             * This would check for any updates to the version or build and prompt the user to update if any are found.
                             */
                            await Updater.checkForUpdates();
                        }}
                    />
                    <FormDivider />
                    {/**
                    * The main repository. This would allow the user to open an external window inside of Discord using Router and display the current dislate repo, on GitHub.
                    * @uses @param {number} Icons.Open: The main @arg {external} open icon.
                    */}
                    <FormRow
                        label="Source"
                        subLabel={`Open the repository of ${name} externally.`}
                        onLongPress={() => Miscellaneous.displayToast(`Opens the repository of ${name} on GitHub in an external page to view any source code of the plugin.`, 'tooltip')}
                        leading={<FormRow.Icon style={styles.icon} source={Icons.Open} />}
                        trailing={() => <FormRow.Arrow />}
                        onPress={() => {
                            /**
                             * Simply opens the plugin repository externally to the user using the Router.
                             * @uses @param {string} plugin.repo: The blob link of the plugin.
                             */
                            Router.openURL(plugin.repo)
                        }}
                    />
                </View>
            </>} />
        </View>
        {/**
         * Renders a simple FormRow with a version and build to display to the user. This is unnecessary as there as multiple ways to view this but it adds slightly more polish to the Settings Panel.
         */}
        <Text style={styles.subheaderText}>
            {`Build: (${plugin.hash}) Release: (${release})`}
        </Text>
   </ScrollView>
};