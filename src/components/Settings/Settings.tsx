import { get, getBoolean, set } from 'enmity/api/settings';
import { FormDivider, FormRow, FormSwitch, ScrollView, Text, View } from 'enmity/components';
import { getByProps } from 'enmity/metro';
import { React, Storage, Toasts, NavigationNative, Clipboard } from 'enmity/metro/common';
import { Miscellaneous, Format, Icons, Updater } from '../../common';
import Credits from './Credits';
import SectionWrapper from '../Wrappers/SectionWrapper'
import { Languages } from '../Pages';
import { renderActionSheet } from '../Modals/DebugInfoActionSheet';
import { styles } from './Settings.styles';
import { SettingsProps } from '../../def';
import LanguageRow from './LanguageRow';
import { version } from 'enmity/api/native';

const Router = getByProps('transitionToGuild', 'openURL');
const LazyActionSheet = getByProps("openLazy", "hideActionSheet");
const optionalMargin = parseInt(version.split(".")[0]) > 163 ? 15 : 0;

export default ({ settings, manifest, languages, renderPage }: SettingsProps) => {
    const Navigation = NavigationNative.useNavigation();

    return <ScrollView>
        <Credits manifest={manifest} /> 
        <View style={{marginTop: 20}}>
            <SectionWrapper label='Language'>
                <View style={styles.container}>
                    <LanguageRow 
                        manifest={manifest} 
                        renderPage={renderPage} 
                        Navigation={Navigation} 
                        languages={languages} kind={"to"}                        
                    />
                    <FormDivider/>
                    <LanguageRow 
                        manifest={manifest} 
                        renderPage={renderPage} 
                        Navigation={Navigation} 
                        languages={languages} kind={"from"}                        
                    />
                    <FormDivider/>
                    <FormRow
                        label='Abbreviate Language'
                        leading={<FormRow.Icon style={styles.icon} source={Icons.Retry} />}
                        subLabel={`Label language in a shorter form when translating (English ➝ EN).`}
                        onLongPress={() => Miscellaneous.displayToast('Convert the full language name to an abbreviation when translating someone else\'s message. (test [English] ➝ test [EN])', 'tooltip')}
                        trailing={() => <FormSwitch
                            value={settings.getBoolean('DislateLangAbbr', false)}
                            style={{ marginLeft: -optionalMargin }}
                            onValueChange={() => {
                                settings.toggle('DislateLangAbbr', false)
                                Toasts.open({ 
                                    content: `Successfully ${settings.getBoolean('DislateLangAbbr', false) ? 'enabled' : 'disabled'} language abbreviations.`, 
                                    source: Icons.Settings.Toasts.Settings 
                                });
                            }}
                        />}
                    />
                    <FormDivider/>
                    <FormRow
                        label='Send Original'
                        leading={<FormRow.Icon style={styles.icon} source={Icons.Settings.Locale} />}
                        subLabel={`Send both the Original and Translated message when using /translate.`}
                        onLongPress={() => Miscellaneous.displayToast('When using the /translate command, send both the original message and the translated message at once.', 'tooltip')}
                        trailing={() => <FormSwitch
                            value={settings.getBoolean('DislateBothLangToggle', false)}
                            style={{ marginLeft: -optionalMargin }}
                            onValueChange={() => {    
                                settings.toggle('DislateBothLangToggle', false)
                                Toasts.open({ 
                                    content: `Now sending ${settings.getBoolean('DislateBothLangToggle', false) ? 'original and translated' : 'only translated'} message.`, 
                                    source: Icons.Settings.Toasts.Settings 
                                });
                            }}
                        />}
                    />
                </View>
            </SectionWrapper>
            <SectionWrapper label='Utility'>
                <View style={styles.container}>
                    <FormRow
                        label='Initialisation Toasts'
                        leading={<FormRow.Icon style={styles.icon} source={Icons.Settings.Initial} />}
                        subLabel={`Toggle initialisation toasts to display loading state of ${manifest.name}.`}
                        onLongPress={() => Miscellaneous.displayToast(`When Enmity is first started, show toasts based on ${manifest.name}'s current state (starting, failed, retrying, etc)`, 'tooltip')}
                        trailing={() => <FormSwitch
                            value={settings.getBoolean('toastEnable', false)}
                            style={{ marginLeft: -optionalMargin }}
                            onValueChange={() => {
                                settings.toggle('toastEnable', false)

                                Toasts.open({ 
                                    content: `Successfully ${settings.getBoolean('toastEnable', false) ? 'enabled' : 'disabled'} Load Toasts.`, 
                                    source: Icons.Settings.Toasts.Settings 
                                });
                            }}
                        />}
                    />
                    <FormDivider />
                    <FormRow
                        label='Open Debug Info'
                        subLabel={`Open useful page to copy debug information like version and build of ${manifest.name} to clipboard.`}
                        onLongPress={() => Miscellaneous.displayToast(`Copy the full debug log to clipboard including ${manifest.name}'s Version, Build, and Release, Enmity's Version and Build, etc.`, 'tooltip')}
                        leading={<FormRow.Icon style={styles.icon} source={Icons.Copy} />}
                        trailing={() => <FormRow.Arrow style={{ marginLeft: -optionalMargin }} />}
                        onPress={() => {
                            renderActionSheet({
                                onConfirm: (debugLog: string, type: string) => {
                                    LazyActionSheet.hideActionSheet()
                                    Clipboard.setString(debugLog);
                                    Miscellaneous.displayToast(`${type}`, 'clipboard')
                                }, 
                                type: "copy"
                            })
                        }}
                    />
                    <FormDivider />
                    <FormRow
                        label='Clear Stores'
                        subLabel={`Void most of the settings and stores used throughout ${manifest.name} to store data locally.`}
                        onLongPress={() => Miscellaneous.displayToast(`Clear stores and settings throughout ${manifest.name} including the settings to hide popups forever and the list of device codes.`, 'tooltip')}
                        leading={<FormRow.Icon style={styles.icon} source={Icons.Delete} />}
                        trailing={() => <FormRow.Arrow style={{ marginLeft: -optionalMargin }} />}
                        onPress={async function() {
                            const storeItems: any = JSON.parse(get(manifest.name, "state_store", null) as string) ?? []
                            for (let i = 0; i < storeItems.length; i++) {
                                const item = storeItems[i];
                                
                                item.type==='storage'
                                    ? await Storage.removeItem(item.name)
                                    : set(manifest.name, item.name, item.override ?? false)
                            }

                            set(manifest.name, "state_store", null);

                            Toasts.open({ 
                                content: `Cleared all ${manifest.name} stores.`, 
                                source: Icons.Settings.Toasts.Settings 
                            });
                        }}
                    />
                </View>
            </SectionWrapper>
            <SectionWrapper label='Source'>
                <View style={styles.container}>
                    <FormRow
                        label="Check for Updates"
                        subLabel={`Search for any ${manifest.name} updates and notify you if an update is available.`}
                        onLongPress={() => Miscellaneous.displayToast(`Search GitHub for any new version or build of ${manifest.name} and prompts you to update, and then prompts you to restart Enmity afterwards.`, 'tooltip')}
                        leading={<FormRow.Icon style={styles.icon} source={Icons.Settings.Update} />}
                        trailing={() => <FormRow.Arrow style={{ marginLeft: -optionalMargin }} />}
                        onPress={ async function() {
                            await Updater.checkForUpdates();
                        }}
                    />
                    <FormDivider />
                    <FormRow
                        label="Source"
                        subLabel={`Open the repository of ${manifest.name} externally.`}
                        onLongPress={() => Miscellaneous.displayToast(`Opens the repository of ${manifest.name} on GitHub in an external page to view any source code of the plugin.`, 'tooltip')}
                        leading={<FormRow.Icon style={styles.icon} source={Icons.Open} />}
                        trailing={() => <FormRow.Arrow />}
                        onPress={() => {
                            Router.openURL(manifest.plugin.repo)
                        }}
                    />
                </View>
            </SectionWrapper>
        </View>
        <Text style={styles.subheaderText}>
            {`Build: (${manifest.plugin.hash}) Release: (${manifest.release})`}
        </Text>
   </ScrollView>
};